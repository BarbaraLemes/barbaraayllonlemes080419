import { useState, useEffect } from "react";
import { tutoresService } from "../services/tutores.service";
import type { TutorDetail } from "../types/tutores.types";

export function useTutorDetail(id: number) {
  const [tutor, setTutor] = useState<TutorDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTutor = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await tutoresService.getTutorById(id);
      setTutor(data);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar tutor");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadTutor();
    }
  }, [id]);

  return {
    tutor,
    isLoading,
    error,
    loadTutor,
  };
}