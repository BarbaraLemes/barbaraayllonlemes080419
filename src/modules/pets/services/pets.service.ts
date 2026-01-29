import { api } from "../../auth/services/api";
import type { PetsResponse, PetsQueryParams, Pet, PetRequest, PetDetail, PetFoto } from "../types/pets.types";

class PetsService {
  private readonly BASE_PATH = "/v1/pets";

  async getPets(params?: PetsQueryParams): Promise<PetsResponse> {
    const response = await api.get<PetsResponse>(this.BASE_PATH, {
      params: {
        nome: params?.nome,
        raca: params?.raca,
        page: params?.page ?? 0,
        size: params?.size ?? 10,
      },
    });

    return response.data;
  }

  async getPetById(id: number): Promise<PetDetail> {
    const response = await api.get<PetDetail>(`${this.BASE_PATH}/${id}`);
    return response.data;
  }

  async createPet(data: PetRequest): Promise<Pet> {
    const response = await api.post<Pet>(this.BASE_PATH, data);
    return response.data;
  }

  async updatePet(id: number, data: PetRequest): Promise<Pet> {
    const response = await api.put<Pet>(`${this.BASE_PATH}/${id}`, data);
    return response.data;
  }

  async deletePet(id: number): Promise<void> {
    await api.delete<void>(`${this.BASE_PATH}/${id}`);
  }

  async uploadFotoPet(id: number, foto: File) {
    const formData = new FormData();
    formData.append("foto", foto);

    const response = await api.post<PetFoto>(`${this.BASE_PATH}/${id}/fotos`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  async deleteFotoPet(id: number, fotoId: number): Promise<void> {
    await api.delete<void>(`${this.BASE_PATH}/${id}/fotos/${fotoId}`);
  }
}

export const petsService = new PetsService();