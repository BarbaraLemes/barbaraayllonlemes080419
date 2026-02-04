import { describe, it, expect, vi, beforeEach } from 'vitest';
import { petsService } from './pets.service';
import { api } from '../../auth/services/api';
import type { Pet, PetDetail, PetsQueryParams, PetsResponse, PetRequest } from '../types/pets.types';

vi.mock('../../auth/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('PetsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPets', () => {
    it('deve buscar lista de pets com sucesso', async () => {
      const mockResponse: PetsResponse = {
        content: [
          {
            id: 1,
            nome: 'Rex',
            raca: 'Labrador',
            idade: 3,
            foto: { id: 1, nome: 'petfoto.jpg', contentType: 'image/jpeg', url: 'http://example.com/petfoto.jpg'},
          },
        ],
        total: 1,
        page: 1,
        size: 10,
        pageCount: 0,
      };

      vi.mocked(api.get).mockResolvedValueOnce({ data: mockResponse });

      const params: PetsQueryParams = {
        nome: 'Rex',
        page: 0,
        size: 10,
      };

      const result = await petsService.getPets(params);

      expect(api.get).toHaveBeenCalledWith('/v1/pets', {
        params: {
          nome: 'Rex',
          raca: undefined,
          page: 0,
          size: 10,
        },
      });
      expect(result.content).toHaveLength(1);
      expect(result.content[0].nome).toBe('Rex');
    });

    it('deve usar valores padrão quando não houver parâmetros', async () => {
      const mockResponse: PetsResponse = {
        content: [],
        total: 0,
        page: 0,
        size: 10,
        pageCount: 0,
      };

      vi.mocked(api.get).mockResolvedValueOnce({ data: mockResponse });

      await petsService.getPets();

      expect(api.get).toHaveBeenCalledWith('/v1/pets', {
        params: {
          nome: undefined,
          raca: undefined,
          page: 0,
          size: 10,
        },
      });
    });
  });

  describe('getPetById', () => {
    it('deve buscar pet por ID com sucesso', async () => {
      const mockPet: PetDetail = {
        id: 1,
        nome: 'Rex',
        raca: 'Labrador',
        idade: 3,
        foto: { id: 1, nome: 'petfoto.jpg', contentType: 'image/jpeg', url: 'http://example.com/petfoto.jpg'},
        tutores: [
          {
            id: 1,
            nome: 'João Silva',
            cpf: 12345678900,
            email: 'joao@email.com',
            telefone: '11999999999',
            endereco: 'Rua A, 123',
            foto: { id: 1, nome: 'tutor-foto.jpg', contentType: 'image/jpeg', url: 'http://example.com/tutor-foto.jpg' },
          }
        ],
      };

      vi.mocked(api.get).mockResolvedValueOnce({ data: mockPet });

      const result = await petsService.getPetById(1);

      expect(api.get).toHaveBeenCalledWith('/v1/pets/1');
      expect(result.nome).toBe('Rex');
      expect(result.tutores[0]?.nome).toBe('João Silva');
    });

    it('deve lançar erro quando pet não for encontrado', async () => {
      vi.mocked(api.get).mockRejectedValueOnce(new Error('Pet não encontrado'));

      await expect(petsService.getPetById(999)).rejects.toThrow('Pet não encontrado');
    });
  });

  describe('createPet', () => {
    it('deve criar pet com sucesso', async () => {
      const newPet: PetRequest = {
        nome: 'Buddy',
        idade: 2,
        raca: 'Golden Retriever',
      };

      const mockResponse: Pet = {
        id: 2,
        ...newPet,
        foto: { id: 2, nome: 'foto.jpg', contentType: 'image/jpeg', url: 'http://example.com/foto.jpg' },
      };

      vi.mocked(api.post).mockResolvedValueOnce({ data: mockResponse });

      const result = await petsService.createPet(newPet);

      expect(api.post).toHaveBeenCalledWith('/v1/pets', newPet);
      expect(result.id).toBe(2);
      expect(result.nome).toBe('Buddy');
    });
  });

  describe('updatePet', () => {
    it('deve atualizar pet com sucesso', async () => {
      const updateData: PetRequest = {
        nome: 'Rex Atualizado',
        idade: 4,
        raca: 'Labrador',
      };

      const mockResponse: Pet = {
        id: 1,
        ...updateData,
        foto: { id: 1, nome: 'petfoto.jpg', contentType: 'image/jpeg', url: 'http://example.com/petfoto.jpg'},
      };

      vi.mocked(api.put).mockResolvedValueOnce({ data: mockResponse });

      const result = await petsService.updatePet(1, updateData);

      expect(api.put).toHaveBeenCalledWith('/v1/pets/1', updateData);
      expect(result.nome).toBe('Rex Atualizado');
    });
  });

  describe('deletePet', () => {
    it('deve deletar pet com sucesso', async () => {
      vi.mocked(api.delete).mockResolvedValueOnce({ data: undefined });

      await petsService.deletePet(1);

      expect(api.delete).toHaveBeenCalledWith('/v1/pets/1');
    });

    it('deve lançar erro ao deletar pet inexistente', async () => {
      vi.mocked(api.delete).mockRejectedValueOnce(new Error('Pet não encontrado'));

      await expect(petsService.deletePet(999)).rejects.toThrow('Pet não encontrado');
    });
  });

  describe('uploadFotoPet', () => {
    it('deve fazer upload de foto com sucesso', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockResponse = {
        id: 1,
        url: 'http://example.com/foto.jpg',
      };

      vi.mocked(api.post).mockResolvedValueOnce({ data: mockResponse });

      const result = await petsService.uploadFotoPet(1, mockFile);

      expect(api.post).toHaveBeenCalledWith(
        '/v1/pets/1/fotos',
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      expect(result.url).toBe('http://example.com/foto.jpg');
    });
  });
});
