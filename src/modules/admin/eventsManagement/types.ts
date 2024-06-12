export type Event = {
  id: number;
  name: string;
  description: string;
  location: string;
  event_date: string;
  address_id: number;
  address: Address;
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

export type PaginatedEventResponse = {
  data: Event[];
};

export interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}
