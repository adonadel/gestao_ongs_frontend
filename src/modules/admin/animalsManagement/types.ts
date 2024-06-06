export enum AnimalStatus {
  ENABLED = "ENABLED",
  DISABLED = "DISABLED",
}

export type Media = {
  id: number;  
  is_cover: boolean;
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
  medias: Media[];
};



export type PaginatedAnimalResponse = {
  data: Animal[];
};