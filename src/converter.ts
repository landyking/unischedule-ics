import { Paper, PaperEvent, PaperBreak, IcsEvent, IcsCalendar } from './types';

/**
 * Date and time utility functions
 */

/**
 * Converts YYYY-MM-DD date string to Date object
 * @param dateString Date string in YYYY-MM-DD format
 * @returns Date object
 */
export const parseSimpleDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day); // month is 0-indexed in Date constructor
};

/**
 * Converts date and time to ICS date-time format (local time, no timezone)
 * @param date Date object
 * @param timeString Time in HH:MM format
 * @returns ICS formatted date-time string without timezone
 */
export const dateTimeToIcs = (date: Date, timeString: string): string => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  
  const year = newDate.getFullYear();
  const month = String(newDate.getMonth() + 1).padStart(2, '0');
  const day = String(newDate.getDate()).padStart(2, '0');
  const hour = String(newDate.getHours()).padStart(2, '0');
  const minute = String(newDate.getMinutes()).padStart(2, '0');
  const second = String(newDate.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}T${hour}${minute}${second}`;
};

/**
 * Converts current date to ICS timestamp format (local time, no timezone)
 * @returns ICS formatted timestamp string
 */
export const getCurrentIcsTimestamp = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}T${hour}${minute}${second}`;
};

/**
 * Finds the first occurrence of a weekday on or after a given date
 * @param startDate Starting date
 * @param weekday Target weekday (1-7, Monday-Sunday)
 * @returns Date of the first occurrence
 */
export const findFirstWeekdayOccurrence = (startDate: Date, weekday: number): Date => {
  const date = new Date(startDate);
  const currentWeekday = date.getDay() === 0 ? 7 : date.getDay(); // Convert Sunday from 0 to 7
  const daysUntilTarget = (weekday - currentWeekday + 7) % 7;
  date.setDate(date.getDate() + daysUntilTarget);
  return date;
};

/**
 * Generates a unique ID for an event
 * @param paperCode Course code
 * @param eventTitle Event title
 * @param weekday Weekday number
 * @param startTime Start time
 * @returns Unique event ID
 */
export const generateEventId = (paperCode: string, eventTitle: string, weekday: number, startTime: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${paperCode}-${eventTitle}-${weekday}-${startTime.replace(':', '')}-${timestamp}-${random}@unischedule-ics`;
};

/**
 * ICS recurrence and exclusion functions
 */

/**
 * Generates RRULE (recurrence rule) for weekly events
 * @param endDate End date for the recurrence
 * @returns RRULE string
 */
export const generateWeeklyRRule = (endDate: Date): string => {
  const year = endDate.getFullYear();
  const month = String(endDate.getMonth() + 1).padStart(2, '0');
  const day = String(endDate.getDate()).padStart(2, '0');
  const untilDate = `${year}${month}${day}T235959`;
  return `FREQ=WEEKLY;UNTIL=${untilDate}`;
};

/**
 * Generates EXDATE (exception dates) for break periods
 * @param startDate Course start date
 * @param endDate Course end date
 * @param weekday Event weekday (1-7)
 * @param eventStartTime Event start time in HH:MM format
 * @param breaks Array of break periods
 * @returns Array of exception dates in ICS format
 */
export const generateExceptionDates = (
  startDate: Date,
  endDate: Date,
  weekday: number,
  eventStartTime: string,
  breaks: PaperBreak[]
): string[] => {
  const exceptionDates: string[] = [];
  
  for (const breakPeriod of breaks) {
    const breakStart = parseSimpleDate(breakPeriod.startDate);
    const breakEnd = parseSimpleDate(breakPeriod.endDate);
    
    // Find all occurrences of the weekday within the break period
    const firstOccurrence = findFirstWeekdayOccurrence(breakStart, weekday);
    
    let currentDate = new Date(firstOccurrence);
    while (currentDate <= breakEnd) {
      if (currentDate >= breakStart && currentDate <= breakEnd) {
        // Use the same format as DTSTART/DTEND with time
        const exceptionDateTime = dateTimeToIcs(currentDate, eventStartTime);
        exceptionDates.push(exceptionDateTime);
      }
      currentDate.setDate(currentDate.getDate() + 7); // Move to next week
    }
  }
  
  return exceptionDates;
};

/**
 * Event creation functions
 */

/**
 * Creates an ICS event from a paper event
 * @param paper Paper information
 * @param event Event information
 * @returns ICS event object
 */
export const createIcsEvent = (paper: Paper, event: PaperEvent): IcsEvent => {
  const startDate = parseSimpleDate(paper.startDate);
  const endDate = parseSimpleDate(paper.endDate);
  
  // Find the first occurrence of this event
  const firstOccurrence = findFirstWeekdayOccurrence(startDate, event.weekday);
  
  const dtstart = dateTimeToIcs(firstOccurrence, event.startTime);
  const dtend = dateTimeToIcs(firstOccurrence, event.endTime);
  
  const uid = generateEventId(paper.code, event.title, event.weekday, event.startTime);
  const summary = `${paper.code} - ${event.title}`;
  const description = paper.memo ? `${paper.title}\n\n${paper.memo}` : paper.title;
  
  const rrule = generateWeeklyRRule(endDate);
  const exdate = generateExceptionDates(startDate, endDate, event.weekday, event.startTime, paper.breaks);
  
  return {
    uid,
    summary,
    description,
    location: event.location,
    dtstart,
    dtend,
    rrule,
    exdate: exdate.length > 0 ? exdate : undefined
  };
};

/**
 * ICS formatting functions
 */

/**
 * Formats an ICS event as a string
 * @param event ICS event object
 * @returns ICS formatted event string
 */
export const formatIcsEvent = (event: IcsEvent): string => {
  const lines = [
    'BEGIN:VEVENT',
    `UID:${event.uid}`,
    `DTSTAMP:${getCurrentIcsTimestamp()}`,
    `DTSTART:${event.dtstart}`,
    `DTEND:${event.dtend}`,
    `SUMMARY:${event.summary}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.location}`
  ];
  
  if (event.rrule) {
    lines.push(`RRULE:${event.rrule}`);
  }
  
  if (event.exdate && event.exdate.length > 0) {
    lines.push(`EXDATE:${event.exdate.join(',')}`);
  }
  
  lines.push('END:VEVENT');
  
  return lines.join('\r\n');
};

/**
 * Formats an ICS calendar as a string
 * @param calendar ICS calendar object
 * @returns ICS formatted calendar string
 */
export const formatIcsCalendar = (calendar: IcsCalendar): string => {
  const header = [
    'BEGIN:VCALENDAR',
    `VERSION:${calendar.version}`,
    `PRODID:${calendar.prodid}`,
    `CALSCALE:${calendar.calscale}`
  ].join('\r\n');
  
  const events = calendar.events.map(formatIcsEvent).join('\r\n');
  const footer = 'END:VCALENDAR';
  
  return [header, events, footer].join('\r\n');
};

/**
 * Main conversion function
 */

/**
 * Converts university course schedules into .ics calendar format
 * @param papers Array of paper objects containing course information
 * @returns ICS formatted string
 */
export const convertToIcs = (papers: Paper[]): string => {
  const events: IcsEvent[] = [];
  
  // Process each paper and its events
  for (const paper of papers) {
    for (const event of paper.events) {
      try {
        const icsEvent = createIcsEvent(paper, event);
        events.push(icsEvent);
      } catch (error) {
        console.warn(`Failed to create event for ${paper.code} - ${event.title}:`, error);
      }
    }
  }
  
  const calendar: IcsCalendar = {
    events,
    prodid: '-//unischedule-ics//EN',
    version: '2.0',
    calscale: 'GREGORIAN'
  };
  
  return formatIcsCalendar(calendar);
};

/**
 * Hello world function for the library
 * @returns Greeting message
 */
export const helloWorld = (): string => {
  return 'Hello World from unischedule-ics!';
};
