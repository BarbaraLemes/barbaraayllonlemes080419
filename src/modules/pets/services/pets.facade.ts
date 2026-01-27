import { BehaviorSubject, Observable } from "rxjs";
import { petsService } from "./pets.service";
import type { PetsState, PetsQueryParams } from "../types/pets.types";

class PetsFacade {
  private petsStateSubject = new BehaviorSubject<PetsState>({
    pets: [],
    isLoading: false,
    error: null,
    pagination: {
      page: 0,
      size: 10,
      total: 0,
      pageCount: 0,
    },
  });

  public petsState$: Observable<PetsState> = this.petsStateSubject.asObservable();

  get currentState(): PetsState {
    return this.petsStateSubject.value;
  }

  async loadPets(params?: PetsQueryParams): Promise<void> {
    this.setLoading(true);

    try {
      const response = await petsService.getPets(params);
      this.petsStateSubject.next({
        pets: response.content,
        isLoading: false,
        error: null,
        pagination: {
          page: response.page,
          size: response.size,
          total: response.total,
          pageCount: response.pageCount,
        },
      });
    } catch (error: any) {
      const errorMessage = this.getErrorMessage(error);

      this.petsStateSubject.next({
        ...this.currentState,
        isLoading: false,
        error: errorMessage,
      });

      throw error;
    }
  }

  async deletePet(id: number): Promise<void> {
    try {
      await petsService.deletePet(id);
      
      // Remove o pet da lista local
      const updatedPets = this.currentState.pets.filter(pet => pet.id !== id);
      
      this.petsStateSubject.next({
        ...this.currentState,
        pets: updatedPets,
        pagination: {
          ...this.currentState.pagination,
          total: this.currentState.pagination.total - 1,
        },
      });
    } catch (error: any) {
      const errorMessage = this.getErrorMessage(error);
      
      this.petsStateSubject.next({
        ...this.currentState,
        error: errorMessage,
      });

      throw error;
    }
  }

  private setLoading(isLoading: boolean): void {
    this.petsStateSubject.next({
      ...this.currentState,
      isLoading,
      error: null,
    });
  }

  private getErrorMessage(error: any): string {
    if (error.response?.status === 404) {
      return "Nenhum pet encontrado";
    }
    if (error.response?.status === 500) {
      return "Erro no servidor. Tente novamente mais tarde.";
    }
    return "Erro ao carregar pets. Verifique sua conexão.";
  }
}

export const petsFacade = new PetsFacade();