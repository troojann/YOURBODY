
export type ActivityType = 'Caminhada' | 'Corrida' | 'Ciclismo' | 'Academia' | 'Outro';

export interface Activity {
  id: string;
  type: ActivityType;
  duration: number; // in minutes
  distance?: number; // in km
  date: string; // ISO format
  notes?: string;
}

export interface DailyStats {
  date: string;
  activities: Activity[];
}
