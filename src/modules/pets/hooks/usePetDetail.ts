import { useEffect, useState } from "react";
import { petsService } from "../services/pets.service";
import type { PetDetail } from "../types/pets.types";

interface UsePetDetailReturn {
  pet: PetDetail | null;
  isLoading: boolean;
  error: string | null;
}

export function usePetDetail(id: number): UsePetDetailReturn {
  const [pet, setPet] = useState<PetDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPetDetail();
  }, [id]);

  const loadPetDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const petData = await petsService.getPetById(id);
      setPet(petData);
    } catch (err: any) {
      setError(
        err.response?.status === 404
          ? "Pet não encontrado"
          : "Erro ao carregar detalhes do pet"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { pet, isLoading, error };
}
