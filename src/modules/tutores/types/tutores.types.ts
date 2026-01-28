import type { Pet } from "../../pets/types/pets.types";

export interface TutoresResponse {
  page: number;
  size: number;
  total: number;
  pageCount: number;
  content: Tutor[];
}

export interface Tutor {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf: number;
  foto?: TutorFoto;
}

export interface TutorDetail extends Tutor {
  pets: Pet[];
}

export interface TutorPet {
  id: number;
  nome: string;
  raca: string;
  idade: number;
  foto?: TutorFoto;
}

export interface TutorFoto {
  id: number;
  nome: string;
  contentType: string;
  url: string;
}

export interface TutorQueryParams {
    page?: number;
    nome?: string;
    size?: number;
}

export interface CreateTutorRequest {
    nome: string;
    email: string;
    telefone: string;
    endereco: string;
    cpf: number;
}

export interface TutoresState {
  tutores: Tutor[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    size: number;
    total: number;
    pageCount: number;
  };
}