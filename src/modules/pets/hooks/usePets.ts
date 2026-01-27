import { useEffect, useState } from "react";
import { petsFacade } from "../services/pets.facade";
import type { PetsState, PetsQueryParams } from "../types/pets.types";

export function usePets(initialFilters?: PetsQueryParams) {
  const [state, setState] = useState<PetsState>(petsFacade.currentState);

  useEffect(() => {
    const subscription = petsFacade.petsState$.subscribe((newState) => {
      setState(newState);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    loadPets({ ...initialFilters, size: 10 });
  }, []);

  const loadPets = async (params?: PetsQueryParams) => {
    await petsFacade.loadPets(params);
  };

  const deletePet = async (id: number) => {
    await petsFacade.deletePet(id);
  };

  return {
    ...state,
    loadPets,
    deletePet,
  };
}