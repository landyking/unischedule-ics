// Main entry point for the unischedule-ics library

export { Paper, PaperBreak, PaperEvent, IcsEvent, IcsCalendar } from './types';
export { 
  convertToIcs, 
  helloWorld,
  isoToIcsDateTime,
  dateTimeToIcs,
  findFirstWeekdayOccurrence,
  generateEventId,
  generateWeeklyRRule,
  generateExceptionDates,
  createIcsEvent,
  formatIcsEvent,
  formatIcsCalendar
} from './converter';

// Default export
import { convertToIcs, helloWorld } from './converter';

export default {
  convertToIcs,
  helloWorld,
};