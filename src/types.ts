// Data models for the unischedule-ics library

export interface PaperBreak {
  title: string;
  startDate: string; // ISO 8601 format, use UTC
  endDate: string; // ISO 8601 format, use UTC
}

export interface PaperEvent {
  title: string;
  weekday: number; // use 1-7 (Monday to Sunday)
  startTime: string; // use HH:MM format (e.g., "09:00" for 9:00 AM, "14:00" for 2:00 PM)
  endTime: string; // use HH:MM format (e.g., "09:00" for 9:00 AM, "14:00" for 2:00 PM)
  location: string;
}

export interface Paper {
  code: string;
  title: string;
  startDate: string; // ISO 8601 format, use UTC
  endDate: string; // ISO 8601 format, use UTC
  breaks: PaperBreak[];
  memo?: string;
  events: PaperEvent[];
}
