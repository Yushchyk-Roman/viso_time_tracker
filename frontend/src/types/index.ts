export interface TimeEntry {
  id: number;
  date: string;
  projectName: string;
  hours: number;
  description: string;
  createdAt?: string;
}

export type CreateTimeEntryRequest = Omit<TimeEntry, 'id' | 'createdAt'>;