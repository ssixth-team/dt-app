import axios from 'axios';
import type { Reference } from '$lib/../mocks/db';

export interface CreateReferenceDto {
  process: 'design' | 'development' | 'testing' | 'deployment';
  rev: 'A' | 'B' | 'C' | 'D';
  createUser: {
    id: string;
    name: string;
    email: string;
  };
}

export interface UpdateReferenceDto {
  process?: 'design' | 'development' | 'testing' | 'deployment';
  rev?: 'A' | 'B' | 'C' | 'D';
  createUser?: {
    id: string;
    name: string;
    email: string;
  };
}

// References API
export const getReferences = async (): Promise<Reference[]> => {
  const response = await axios.get('/api/references');
  return response.data;
};

export const getReference = async (id: number): Promise<Reference> => {
  const response = await axios.get(`/api/references/${id}`);
  return response.data;
};

export const createReference = async (data: CreateReferenceDto): Promise<Reference> => {
  const response = await axios.post('/api/references', data);
  return response.data;
};

export const updateReference = async (id: number, data: UpdateReferenceDto): Promise<Reference> => {
  const response = await axios.put(`/api/references/${id}`, data);
  return response.data;
};

export const deleteReference = async (id: number): Promise<void> => {
  await axios.delete(`/api/references/${id}`);
};
