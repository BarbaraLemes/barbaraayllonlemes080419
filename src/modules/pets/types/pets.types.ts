import type { Tutor } from "../../tutores/types/tutores.types";

export interface Pet {
  id: number;
  nome: string;
  raca: string;
  idade: number;
  foto?: PetFoto;
}

export interface PetFoto {
  id: number;
  nome: string;
  contentType: string;
  url: string;
}

export interface PetRequest {
  nome: string;
  raca: string;
  idade: number;
}

export interface PetsResponse {
  page: number;
  size: number;
  total: number;
  pageCount: number;
  content: Pet[];
}

export interface PetsQueryParams {
  nome?: string;
  raca?: string;
  page?: number;
  size?: number;
}

export interface PetsState {
  pets: Pet[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    size: number;
    total: number;
    pageCount: number;
  };
}

export interface PetDetail extends Pet {
  tutores: Tutor[];
}