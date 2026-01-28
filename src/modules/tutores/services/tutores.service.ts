import { api } from "../../auth/services/api";
import type { CreateTutorRequest, Tutor, TutorDetail, TutorFoto, TutorQueryParams, TutoresResponse } from "../types/tutores.types";

class TutoresService {
  private readonly BASE_URL = "/v1/tutores";

  async listarTutores(params?: TutorQueryParams): Promise<TutoresResponse> {
    const response = await api.get<TutoresResponse>(`${this.BASE_URL}`, {
      params: {
        nome: params?.nome,
        page: params?.page ?? 0,
        size: params?.size ?? 10,
      },
    });
    return response.data;
  }

  async getTutorById(id: number): Promise<TutorDetail> {
    const response = await api.get<TutorDetail>(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  async novoTutor(data: CreateTutorRequest): Promise<Tutor> {
    const response = await api.post<Tutor>(`${this.BASE_URL}`, data);
    return response.data;
  }

  async editarTutor(id: number, data: Partial<CreateTutorRequest>): Promise<Tutor> {
    const response = await api.put<Tutor>(`${this.BASE_URL}/${id}`, data);
    return response.data;
  }

  async deleteTutor(id: number): Promise<void> {
    await api.delete<void>(`${this.BASE_URL}/${id}`);
  }

  async uploadFotoTutor(id: number, foto: File) {
    const formData = new FormData();
    formData.append("foto", foto);

    const response = await api.post<TutorFoto>(`${this.BASE_URL}/${id}/fotos`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  async deleteFotoTutor(id: number, fotoId: number): Promise<void> {
    await api.delete<void>(`${this.BASE_URL}/${id}/fotos/${fotoId}`);
  }

  // Operações de vincular e desvincular pets e tutores
  async vincularPetTutor(id: number, petId: number): Promise<void> {
    await api.post(`${this.BASE_URL}/${id}/pets/${petId}`);
  }

  async removerVinculoPetTutor(id: number, petId: number): Promise<void> {
    await api.delete(`${this.BASE_URL}/${id}/pets/${petId}`);
  }
}

export const tutoresService = new TutoresService();
