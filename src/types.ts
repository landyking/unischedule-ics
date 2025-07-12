// Data models for the unischedule-ics library

export interface PaperBreak {
  title: string;
  startDate: string; // use YYYY-MM-DD format
  endDate: string; // use YYYY-MM-DD format
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
  startDate: string; // use YYYY-MM-DD format
  endDate: string; // use YYYY-MM-DD format
  breaks: PaperBreak[];
  memo?: string;
  events: PaperEvent[];
}

// Additional interfaces for ICS generation
export interface IcsEvent {
  uid: string;
  summary: string;
  description: string;
  location: string;
  dtstart: string; // YYYYMMDDTHHMMSS format (local time, no timezone)
  dtend: string; // YYYYMMDDTHHMMSS format (local time, no timezone)
  rrule?: string; // Recurrence rule
  exdate?: string[]; // Exception dates
}

export interface IcsCalendar {
  events: IcsEvent[];
  prodid: string;
  version: string;
  calscale: string;
}
