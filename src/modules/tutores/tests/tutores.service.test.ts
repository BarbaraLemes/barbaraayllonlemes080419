import { describe, it, expect, vi, beforeEach } from 'vitest';
import { tutoresService } from '../services/tutores.service';
import { api } from '../../auth/services/api';
import type { Tutor, TutorDetail, TutorQueryParams, TutoresResponse, CreateTutorRequest } from '../types/tutores.types';

vi.mock('../../auth/services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('TutoresService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTutores', () => {
    it('deve buscar lista de tutores com sucesso', async () => {
      const mockResponse: TutoresResponse = {
        content: [
          {
            id: 1,
            nome: 'João Silva',
            cpf: 12345678900,
            email: 'joao@email.com',
            telefone: '11999999999',
            endereco: 'Rua A, 123',
            foto: { id: 1, nome: 'foto.jpg', contentType: 'image/jpeg', url: 'http://example.com/foto.jpg' },
          },
        ],
        total: 1,
        page: 1,
        size: 10,
        pageCount: 0,
      };

      vi.mocked(api.get).mockResolvedValueOnce({ data: mockResponse });

      const params: TutorQueryParams = {
        nome: 'João',
        page: 0,
        size: 10,
      };

      const result = await tutoresService.getTutores(params);

      expect(api.get).toHaveBeenCalledWith('/v1/tutores', {
        params: {
          nome: 'João',
          page: 0,
          size: 10,
        },
      });
      expect(result.content).toHaveLength(1);
      expect(result.content[0].nome).toBe('João Silva');
    });

    it('deve usar valores padrão quando não houver parâmetros', async () => {
      const mockResponse: TutoresResponse = {
        content: [],
        total: 0,
        page: 0,
        size: 10,
        pageCount: 0,
      };

      vi.mocked(api.get).mockResolvedValueOnce({ data: mockResponse });

      await tutoresService.getTutores();

      expect(api.get).toHaveBeenCalledWith('/v1/tutores', {
        params: {
          nome: undefined,
          page: 0,
          size: 10,
        },
      });
    });
  });

  describe('getTutorById', () => {
    it('deve buscar tutor por ID com sucesso', async () => {
      const mockTutor: TutorDetail = {
        id: 1,
        nome: 'João Silva',
        cpf: 12345678900,
        email: 'joao@email.com',
        telefone: '11999999999',
        endereco: 'Rua A, 123',
        foto: { id: 1, nome: 'foto.jpg', contentType: 'image/jpeg', url: 'http://example.com/foto.jpg' },
        pets: [
          {
            id: 1,
            nome: 'Rex',
            idade: 3,
            raca: 'Labrador',
            foto: { id: 1, nome: 'petfoto.jpg', contentType: 'image/jpeg', url: 'http://example.com/petfoto.jpg'},
          },
        ],
      };

      vi.mocked(api.get).mockResolvedValueOnce({ data: mockTutor });

      const result = await tutoresService.getTutorById(1);

      expect(api.get).toHaveBeenCalledWith('/v1/tutores/1');
      expect(result.nome).toBe('João Silva');
      expect(result.pets).toHaveLength(1);
      expect(result.pets[0].nome).toBe('Rex');
    });

    it('deve lançar erro quando tutor não for encontrado', async () => {
      vi.mocked(api.get).mockRejectedValueOnce(new Error('Tutor não encontrado'));

      await expect(tutoresService.getTutorById(999)).rejects.toThrow('Tutor não encontrado');
    });
  });

  describe('createTutor', () => {
    it('deve criar tutor com sucesso', async () => {
      const newTutor: CreateTutorRequest = {
        nome: 'Maria Santos',
        cpf: 98765432100,
        email: 'maria@email.com',
        telefone: '11988888888',
        endereco: 'Rua B, 456',
      };

      const mockResponse: Tutor = {
        id: 2,
        ...newTutor,
        foto: { id: 2, nome: 'foto.jpg', contentType: 'image/jpeg', url: 'http://example.com/foto.jpg' },
      };

      vi.mocked(api.post).mockResolvedValueOnce({ data: mockResponse });

      const result = await tutoresService.createTutor(newTutor);

      expect(api.post).toHaveBeenCalledWith('/v1/tutores', newTutor);
      expect(result.id).toBe(2);
      expect(result.nome).toBe('Maria Santos');
    });

    it('deve lançar erro ao criar tutor com CPF duplicado', async () => {
      const newTutor: CreateTutorRequest = {
        nome: 'João Silva',
        cpf: 12345678900,
        endereco: 'Rua A, 123',
        email: 'joao2@email.com',
        telefone: '11977777777',
      };

      vi.mocked(api.post).mockRejectedValueOnce(new Error('CPF já cadastrado'));

      await expect(tutoresService.createTutor(newTutor)).rejects.toThrow('CPF já cadastrado');
    });
  });

  describe('updateTutor', () => {
    it('deve atualizar tutor com sucesso', async () => {
      const updateData: Partial<CreateTutorRequest> = {
        telefone: '11966666666',
        email: 'joao.novo@email.com',
      };

      const mockResponse: Tutor = {
        id: 1,
        nome: 'João Silva',
        cpf: 12345678900,
        email: 'joao.novo@email.com',
        telefone: '11966666666',
        endereco: 'Rua A, 123',
        foto: { id: 1, nome: 'foto.jpg', contentType: 'image/jpeg', url: 'http://example.com/foto.jpg' },
      };

      vi.mocked(api.put).mockResolvedValueOnce({ data: mockResponse });

      const result = await tutoresService.updateTutor(1, updateData);

      expect(api.put).toHaveBeenCalledWith('/v1/tutores/1', updateData);
      expect(result.telefone).toBe('11966666666');
      expect(result.email).toBe('joao.novo@email.com');
    });
  });

  describe('deleteTutor', () => {
    it('deve deletar tutor com sucesso', async () => {
      vi.mocked(api.delete).mockResolvedValueOnce({ data: undefined });

      await tutoresService.deleteTutor(1);

      expect(api.delete).toHaveBeenCalledWith('/v1/tutores/1');
    });

    it('deve lançar erro ao deletar tutor com pets vinculados', async () => {
      vi.mocked(api.delete).mockRejectedValueOnce(
        new Error('Não é possível deletar tutor com pets vinculados')
      );

      await expect(tutoresService.deleteTutor(1)).rejects.toThrow(
        'Não é possível deletar tutor com pets vinculados'
      );
    });
  });

  describe('uploadFotoTutor', () => {
    it('deve fazer upload de foto com sucesso', async () => {
      const mockFile = new File(['test'], 'profile.jpg', { type: 'image/jpeg' });
      const mockResponse = {
        id: 1,
        url: 'http://example.com/profile.jpg',
      };

      vi.mocked(api.post).mockResolvedValueOnce({ data: mockResponse });

      const result = await tutoresService.uploadFotoTutor(1, mockFile);

      expect(api.post).toHaveBeenCalledWith(
        '/v1/tutores/1/fotos',
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      expect(result.url).toBe('http://example.com/profile.jpg');
    });
  });

  describe('deleteFotoTutor', () => {
    it('deve deletar foto do tutor com sucesso', async () => {
      vi.mocked(api.delete).mockResolvedValueOnce({ data: undefined });

      await tutoresService.deleteFotoTutor(1, 5);

      expect(api.delete).toHaveBeenCalledWith('/v1/tutores/1/fotos/5');
    });
  });
});
