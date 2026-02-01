import { useState, useEffect } from "react";
import { tutoresService } from "../services/tutores.service";
import type { Tutor, TutorQueryParams, TutoresState } from "../types/tutores.types";

export function useTutors() {
  const [state, setState] = useState<TutoresState>({
    tutores: [],
    isLoading: true,
    error: null,
    pagination: {
      page: 0,
      size: 10,
      total: 0,
      pageCount: 0,
    },
  });

  const loadTutores = async (params?: TutorQueryParams) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await tutoresService.getTutores(params);
      setState({
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
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err.message || "Erro ao carregar tutores",
      }));
    }
  };

  useEffect(() => {
    loadTutores();
  }, []);

  return {
    tutores: state.tutores,
    isLoading: state.isLoading,
    error: state.error,
    pagination: state.pagination,
    loadTutores,
  };
}