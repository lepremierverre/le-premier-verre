export type SearchType =
  | "wine"
  | "producer"
  | "country"
  | "region"
  | "grape"
  | "article"
  | "guide";

export interface SearchResult {
  _id: string;
  _type: SearchType;
  title: string;
  slug: string;
}
