export enum UserStatus {
  ENABLED = "ENABLED",
  DISABLED = "DISABLED",
}

export type ProfilePicture = {
  filename_id: string;
}

export type Person = {
  id: number;
  name: string;
  email: string;
  phone: string;
  cpf_cnpj: string;
  address_id: number;
  address: Address;
  profile_picture: ProfilePicture;
  profile_picture_id: number;
};

export type Role = {
  id: number;
  name: string;
};

export type Address = {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
  complement: string;
};

export type User = {
  id: number;
  people_id: number;
  password: string;
  person: Person;
  role_id: number;
  role: Role;
  status: UserStatus;
  created_at: string;
};

export type PaginatedUserResponse = {
  data: User[];
};

export interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}
