import { wineFavorite } from "./wineFavorite";
import { atlasTerritory } from "./atlasTerritory";
import { appellation } from "./appellation";
import { article } from "./article";
import { author } from "./author";
import { category } from "./category";
import { country } from "./country";
import { editorialAsset } from "./editorialAsset";
import { food } from "./food";
import { grape } from "./grape";
import { guide } from "./guide";
import { page } from "./page";
import { pageSection } from "./pageSection";
import { place } from "./place";
import { producer } from "./producer";
import { region } from "./region";
import { siteSettings } from "./siteSettings";
import { vineyard } from "./vineyard";
import { wine } from "./wine";
import { wineList } from "./wineList";
import { wineJournalEntry } from "./wineJournalEntry";
import { userPreferences } from "./userPreferences";

export const schemaTypes = [
  // Configuration générale du site
  siteSettings,
  editorialAsset,

  // Pages du site
  pageSection,
  page,

  // Contenu éditorial
  article,
  guide,
  category,
  author,

  // Répertoire
  place,
  vineyard,
  producer,

  // Atlas géographique
  atlasTerritory,

  // Référentiels vin
  country,
  region,
  appellation,
  grape,
  wine,
  food,

  // Fonctionnalités utilisateur
  wineList,
  wineJournalEntry,
  wineFavorite,
  userPreferences,
];
