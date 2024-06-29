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
  animal_type: string;
  created_at: string;
  adoption_status: string;
  medias: string;
};

export type PaginatedAnimalResponse = {
  data: Animal[];
};