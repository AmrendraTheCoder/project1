// types.ts
export type RumourFormType = {
  title?: string;
  description?: string;
  expire_at?: string;
};

export type RumourFormTypeError = {
  title?: string;
  description?: string;
  expire_at?: string;
  image?: string;
};

export interface CustomUser {
  id: string;
  name: string;
  email: string;
  token: string;
  // Add any other user properties you need
}

export type RumourType = {
  id: Number;
  user_id: number;
  title?: string;
  description?: string;
  expire_at?: string;
  image?: string;
  created_at?: string;
  RumourItem: Array<RumourItem>;
  RumourComment: Array<RumourComment>;
};

export type RumourItemForm = {
  image: File | null;
};

export type RumourItem = {
  id: number;
  count: number;
  image: string;
};

export type RumourComment = {
  id: number;
  comment: string;
  create_at: string;
};
