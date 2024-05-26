export enum UserStatus {
  ENABLED = "ENABLED",
  DISABLED = "DISABLED",
}

export type User = {
  id: number;
  role_id: number;
  people_id: number;
  created_at: string;
  person: Person;
  role: Role;
  status: UserStatus;
};

export type PaginatedUserResponse = {
  data: User[];
};

export type Person = {
  id: number;
  name: string;
  email: string;
  cpf_cnpj: string;
  address: AddressValues;
  profile_picture_id: number;
};

export type Role = {
  id: number;
  name: string;
};

export type UserValues = {
  password: string;
  person: Person;
  role: Role;
  role_id: number;
  address_id: number;
  address: AddressValues;
  
};

export type AddressValues = {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
};

export type RoleValues = {
  id: number;
  name: string;
};

export interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}
