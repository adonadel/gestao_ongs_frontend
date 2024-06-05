export enum AnimalStatus {
  ENABLED = "ENABLED",
  DISABLED = "DISABLED",
}

export type Animal = {
  id: number;
  name: string
  gender: string;
  size: string;
  age_type: string;
  castrate_type: string;
  description: string;
  location: string;
  tags: string;
  specie: string;
  created_at: string;
  medias: any[];
};

export type PaginatedAnimalResponse = {
  data: Animal[];
};