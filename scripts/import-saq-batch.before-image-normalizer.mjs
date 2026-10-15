import {createClient} from "@sanity/client";
import crypto from "node:crypto";
import wines from "./batch-saq-01.mjs";

const WRITE=process.argv.includes("--write");
const client=createClient({
  projectId:"czq6bjyu",dataset:"production",apiVersion:"2025-08-15",
  useCdn:false,token:process.env.SANITY_API_WRITE_TOKEN||process.env.SANITY_API_TOKEN
});

const slugify=(s="")=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const ref=(id,key)=>({_type:"reference",_ref:id,...(key?{_key:key}:{})});
const block=t=>[{_type:"block",_key:crypto.randomUUID().slice(0,8),style:"normal",markDefs:[],children:[{_type:"span",_key:crypto.randomUUID().slice(0,8),marks:[],text:t}]}];

const data=await client.fetch(`{
 "wines":*[_type=="wine"]{_id,name,sku,purchaseUrl,"slug":slug.current},
 "producers":*[_type=="producer"]{_id,name,"slug":slug.current},
 "grapes":*[_type=="grape"]{_id,name,"slug":slug.current},
 "countries":*[_type=="country"]{_id,name,"slug":slug.current},
 "regions":*[_type=="region"]{_id,name,"slug":slug.current},
 "appellations":*[_type=="appellation"]{_id,name,"slug":slug.current}
}`);

const maps={};
for(const k of ["producers","grapes","countries","regions","appellations"]){
 maps[k]=new Map();
 for(const d of data[k]){maps[k].set(slugify(d.name),d);if(d.slug)maps[k].set(d.slug,d);}
}

const pending=new Map();
function ensure(type,name,extra={}){
 const plural={producer:"producers",grape:"grapes",country:"countries",region:"regions",appellation:"appellations"}[type];
 const key=slugify(name);
 if(maps[plural].has(key)) return maps[plural].get(key);
 const id=`${type}-${key}`;
 let doc={_id:id,_type:type,name,slug:{_type:"slug",current:key},published:false,...extra};
 pending.set(id,doc); maps[plural].set(key,doc); return doc;
}

const existingSku=new Set(data.wines.map(x=>String(x.sku||"")).filter(Boolean));
const existingUrl=new Set(data.wines.map(x=>x.purchaseUrl).filter(Boolean));
const existingSlug=new Set(data.wines.map(x=>x.slug).filter(Boolean));

async function saqImage(url){
 try{
  const r=await fetch(url,{headers:{"User-Agent":"Mozilla/5.0","Accept-Language":"fr-CA,fr;q=0.9"}});
  if(!r.ok)return null;
  const html=await r.text();
  const patterns=[
   /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i,
   /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
   /"image"\s*:\s*"([^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i
  ];
  for(const p of patterns){const m=html.match(p);if(m)return m[1].replaceAll("\\u002F","/").replaceAll("\\/","/").replaceAll("&amp;","&");}
 }catch{}
 return null;
}

async function uploadImage(doc,w){
 const imageUrl=await saqImage(w.purchaseUrl);
 if(!imageUrl){console.log(`   ⚠️ image non trouvée: ${w.name}`);return doc;}
 try{
  const r=await fetch(imageUrl,{headers:{"User-Agent":"Mozilla/5.0","Referer":"https://www.saq.com/"}});
  if(!r.ok)throw new Error(String(r.status));
  const ct=r.headers.get("content-type")||"image/jpeg";
  if(!ct.startsWith("image/"))throw new Error("pas une image");
  const asset=await client.assets.upload("image",Buffer.from(await r.arrayBuffer()),{
   filename:`saq-${w.sku}.${ct.includes("png")?"png":ct.includes("webp")?"webp":"jpg"}`,contentType:ct
  });
  console.log(`   🖼️ image: ${w.name}`);
  return {...doc,bottleImage:{_type:"image",asset:ref(asset._id)}};
 }catch(e){console.log(`   ⚠️ image impossible: ${w.name} (${e.message})`);return doc;}
}

const documents=[];
const skipped=[];

for(const w of wines){
 const wineSlug=slugify(`${w.producer}-${w.name}${w.vintage?`-${w.vintage}`:""}`);
 if(existingSku.has(String(w.sku))||existingUrl.has(w.purchaseUrl)||existingSlug.has(wineSlug)){
  skipped.push(`${w.name} [${w.sku}]`);continue;
 }

 const country=ensure("country",w.country);
 const producer=ensure("producer",w.producer);

 const grapeDocs=w.grapes.map(g=>ensure("grape",g));

 const region=ensure("region",w.region,{
  country:ref(country._id),
  introduction:block(`${w.region} est une région viticole représentée dans la sélection Le Premier Verre.`),
  locationText:`Région viticole de ${w.country}.`,
  latitude:0,longitude:0,
  climate:"Climat à documenter dans la fiche région complète.",
  signatureGrapes:grapeDocs.slice(0,1).map(g=>ref(g._id,slugify(g.name))),
  characteristics:[
   {_type:"regionCharacteristic",_key:"c1",title:"Repère",text:"Région ajoutée lors de l’import du catalogue de vins."},
   {_type:"regionCharacteristic",_key:"c2",title:"Cépages",text:`Sélection actuelle : ${w.grapes.join(", ")}.`},
   {_type:"regionCharacteristic",_key:"c3",title:"À explorer",text:"La fiche éditoriale complète sera enrichie séparément."}
  ]
 });

 const appellation=ensure("appellation",w.appellation,{
  country:ref(country._id),region:ref(region._id)
 });

 let doc={
  ...w,_id:`wine-${wineSlug}`,_type:"wine",
  slug:{_type:"slug",current:wineSlug},
  producer:ref(producer._id),country:ref(country._id),region:ref(region._id),
  appellation:ref(appellation._id),
  grapes:grapeDocs.map(g=>ref(g._id,slugify(g.name))),
  beverageType:"wine",alcoholFree:false,
  decant:false,published:true,
  translationSourceHash:crypto.createHash("sha256").update(JSON.stringify({
   oneLiner:w.oneLiner,tastingKeywords:w.tastingKeywords,
   perfectFor:w.perfectFor,whyWeRecommend:w.whyWeRecommend
  })).digest("hex")
 };
 documents.push({doc,w});
 existingSku.add(String(w.sku));existingUrl.add(w.purchaseUrl);existingSlug.add(wineSlug);
}

console.log("\n════════ LE PREMIER VERRE — LOT SAQ 01 ════════");
console.log(`Sanity actuel : ${data.wines.length}`);
console.log(`Lot demandé   : ${wines.length}`);
console.log(`À importer    : ${documents.length}`);
console.log(`Doublons      : ${skipped.length}`);
console.log(`Références +  : ${pending.size}`);
console.log(`Projection    : ${data.wines.length+documents.length}`);
if(skipped.length) skipped.forEach(x=>console.log("⚠️",x));

if(!WRITE){
 console.log("\n✅ DRY RUN terminé — aucune écriture.");
 console.log("Si la projection est correcte, lance :");
 console.log("node scripts/import-saq-batch.mjs --write\n");
 process.exit(0);
}

if(!process.env.SANITY_API_WRITE_TOKEN&&!process.env.SANITY_API_TOKEN)
 throw new Error("Token Sanity absent.");

const tx=client.transaction();
for(const d of pending.values()) tx.createIfNotExists(d);
await tx.commit();

for(const item of documents){
 item.doc=await uploadImage(item.doc,item.w);
 await client.create(item.doc);
 console.log(`🍷 ${item.w.name}`);
}

const total=await client.fetch(`count(*[_type=="wine"])`);
console.log(`\n✅ LOT 01 TERMINÉ — ${documents.length} vins ajoutés.`);
console.log(`🍷 Total Sanity : ${total}\n`);
