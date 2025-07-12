// Main entry point for the unischedule-ics library

export { Paper, PaperBreak, PaperEvent, IcsEvent, IcsCalendar } from './types';
export { 
  convertToIcs, 
  parseSimpleDate,
  dateTimeToIcs,
  getCurrentIcsTimestamp,
  findFirstWeekdayOccurrence,
  generateEventId,
  generateWeeklyRRule,
  generateExceptionDates,
  createIcsEvent,
  formatIcsEvent,
  formatIcsCalendar
} from './converter';

// Default export
import { convertToIcs } from './converter';

export default {
  convertToIcs
};