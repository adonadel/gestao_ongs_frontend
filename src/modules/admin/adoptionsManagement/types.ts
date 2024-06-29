export type Adoption = {
  id: number;
  description: string;
  status: string;
  animal_id: number;
  user_id: number;
  animal: Animal;
  user: User;
};

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

export type Person = {
  id: number;
  name: string;
  email: string;
  phone: string;
  cpf_cnpj: string;
  address_id: number;
  profile_picture_id: number;
};


export type User = {
  id: number;
  people_id: number;
  password: string;
  person: Person;
  role_id: number;
  created_at: string;
};

export type PaginatedAdoptionResponse = {
  data: Adoption[];
};

export interface CustomProps {
  onChange: (adoption: { target: { name: string; value: string } }) => void;
  name: string;
}