import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

const clerkAppearance = {
  elements: {
    rootBox: "w-full max-w-md mx-auto",
    card: "shadow-none border-0 bg-transparent p-0 w-full",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    socialButtonsBlockButton: "w-full bg-transparent border border-[#E5DFD5] text-[#1C1A17] hover:bg-[#EAE4D9] rounded-none py-3 text-xs tracking-widest font-medium uppercase transition-colors mb-4",
    socialButtonsBlockButtonText: "font-medium tracking-widest uppercase text-xs text-[#1C1A17]",
    dividerLine: "bg-[#E5DFD5]",
    dividerText: "text-[#8C8273] text-xs uppercase tracking-widest bg-[#F7F4EE] px-3",
    formFieldLabel: "text-xs font-semibold uppercase tracking-widest text-[#1C1A17] mb-2",
    formFieldInput: "w-full bg-white border border-[#E5DFD5] rounded-none px-4 py-3 text-sm text-[#1C1A17] focus:outline-none focus:border-[#1C1A17]",
    formButtonPrimary: "w-full bg-[#2B2725] hover:bg-black text-white rounded-none py-3 text-xs tracking-widest font-semibold uppercase transition-colors mt-2",
    footerActionLink: "text-xs font-semibold text-[#1C1A17] underline hover:no-underline",
    footerActionText: "text-xs text-[#5C5549]",
  },
};

export default function InscriptionPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#F7F4EE]">
      <div className="p-8 md:p-16 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E5DFD5]">
        <div>
          <Link href="/" className="inline-block text-xs uppercase tracking-widest text-[#5C5549] hover:text-black mb-12">
            ← RETOUR À L'ACCUEIL
          </Link>
          <span className="block text-xs uppercase tracking-widest text-[#8C8273] mb-4">REJOINDRE LE PREMIER VERRE</span>
          <h1 className="text-5xl md:text-6xl font-serif text-[#1C1A17] mb-6">
            Garde une trace de ce que tu bois.
          </h1>
          <p className="text-lg text-[#5C5549] max-w-md font-light leading-relaxed">
            Crée ton carnet personnel, conserve tes favoris et retrouve les bouteilles qui valent la peine d'être rouvertes.
          </p>
        </div>
        <div className="pt-12 border-t border-[#E5DFD5]">
          <p className="text-xs text-[#8C8273] uppercase tracking-widest mb-2">Tu as déjà un compte ?</p>
          <Link href="/connexion" className="inline-block text-xs font-semibold uppercase tracking-widest text-[#1C1A17] hover:underline">
            SE CONNECTER →
          </Link>
        </div>
      </div>

      <div className="p-8 md:p-16 flex items-center justify-center">
        <SignUp appearance={clerkAppearance} />
      </div>
    </div>
  );
}
