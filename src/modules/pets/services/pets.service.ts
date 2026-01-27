import { api } from "../../auth/services/api";
import type { PetsResponse, PetsQueryParams, Pet, PetRequest, PetDetail } from "../types/pets.types";

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
    const response = await api.post(this.BASE_PATH, data);
    return response.data;
  }

  async updatePet(id: number, data: PetRequest): Promise<Pet> {
    const response = await api.put(`${this.BASE_PATH}/${id}`, data);
    return response.data;
  }

  async deletePet(id: number): Promise<void> {
    await api.delete(`${this.BASE_PATH}/${id}`);
  }
}

export const petsService = new PetsService();