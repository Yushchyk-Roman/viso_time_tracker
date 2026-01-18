import axios from 'axios';

export interface Project {
  id: number;
  name: string;
  color: string;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

export const projectsApi = {
  getAll: async (): Promise<Project[]> => {
    const response = await api.get<Project[]>('/projects');
    return response.data;
  },

  create: async (name: string, color?: string): Promise<Project> => {
    const response = await api.post<Project>('/projects', { name, color });
    return response.data;
  },
};