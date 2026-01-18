import axios from 'axios';
import type { CreateTimeEntryRequest, TimeEntry } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const timeEntriesApi = {
  getAll: async (): Promise<TimeEntry[]> => {
    const response = await api.get<TimeEntry[]>('/time-entries');
    return response.data;
  },

  create: async (data: CreateTimeEntryRequest): Promise<TimeEntry> => {
    const response = await api.post<TimeEntry>('/time-entries', data);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`/time-entries/${id}`);
  },

  update: async (id: number, data: Partial<CreateTimeEntryRequest>): Promise<TimeEntry> => {
    const response = await api.patch<TimeEntry>(`/time-entries/${id}`, data);
    return response.data;
  },
};