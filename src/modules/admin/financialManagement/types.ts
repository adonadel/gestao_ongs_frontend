export type Financial = {
  id: number;
  description: string;
  date: string;
  value: number;
  type: string;
  status: string;
  animal_id: number;
  user_id: number;
};

export type PaginatedFinancialResponse = {
  data: Financial[];
};

export interface CustomProps {
  onChange: (finance: { target: { name: string; value: string } }) => void;
  name: string;
}