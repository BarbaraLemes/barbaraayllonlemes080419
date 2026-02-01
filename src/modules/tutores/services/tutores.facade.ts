import { BehaviorSubject, Observable } from "rxjs";
import { tutoresService } from "./tutores.service";
import type { TutoresState, TutorQueryParams } from "../types/tutores.types";

class TutoresFacade {
  private tutoresStateSubject = new BehaviorSubject<TutoresState>({
    tutores: [],
    isLoading: false,
    error: null,
    pagination: {
      page: 0,
      size: 10,
      total: 0,
      pageCount: 0,
    },
  });

  public tutoresState$: Observable<TutoresState> = this.tutoresStateSubject.asObservable();

  get currentState(): TutoresState {
    return this.tutoresStateSubject.value;
  }

  async loadTutores(params?: TutorQueryParams): Promise<void> {
    this.setLoading(true);

    try {
      const response = await tutoresService.getTutores(params);
      this.tutoresStateSubject.next({
        tutores: response.content,
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

      this.tutoresStateSubject.next({
        ...this.currentState,
        isLoading: false,
        error: errorMessage,
      });

      throw error;
    }
  }

  async deleteTutor(id: number): Promise<void> {
    try {
      await tutoresService.deleteTutor(id);
      
      // Remove o tutor da lista local
      const updatedTutores = this.currentState.tutores.filter(tutor => tutor.id !== id);
      
      this.tutoresStateSubject.next({
        ...this.currentState,
        tutores: updatedTutores,
        pagination: {
          ...this.currentState.pagination,
          total: this.currentState.pagination.total - 1,
        },
      });
    } catch (error: any) {
      const errorMessage = this.getErrorMessage(error);
      
      this.tutoresStateSubject.next({
        ...this.currentState,
        error: errorMessage,
      });

      throw error;
    }
  }

  private setLoading(isLoading: boolean): void {
    this.tutoresStateSubject.next({
      ...this.currentState,
      isLoading,
      error: null,
    });
  }

  private getErrorMessage(error: any): string {
    if (error.response?.status === 404) {
      return "Nenhum tutor encontrado";
    }
    if (error.response?.status === 500) {
      return "Erro no servidor. Tente novamente mais tarde.";
    }
    return "Erro ao carregar tutores. Verifique sua conexão.";
  }
}

export const tutoresFacade = new TutoresFacade();
