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
 * Formats a date to ICS date format (YYYYMMDD)
 * @param date Date object
 * @returns ICS formatted date string
 */
const formatIcsDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

/**
 * Formats a date to ICS time format (HHMMSS)
 * @param date Date object
 * @returns ICS formatted time string
 */
const formatIcsTime = (date: Date): string => {
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  return `${hour}${minute}${second}`;
};

/**
 * Formats a date to ICS datetime format (YYYYMMDDTHHMMSS)
 * @param date Date object
 * @returns ICS formatted datetime string
 */
const formatIcsDateTime = (date: Date): string => {
  return `${formatIcsDate(date)}T${formatIcsTime(date)}`;
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
  return formatIcsDateTime(newDate);
};

/**
 * Converts current date to ICS timestamp format (local time, no timezone)
 * @returns ICS formatted timestamp string
 */
export const getCurrentIcsTimestamp = (): string => {
  return formatIcsDateTime(new Date());
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
  const untilDate = `${formatIcsDate(endDate)}T235959`;
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
 * Creates event summary from paper code and event title
 * @param paperCode Course code
 * @param eventTitle Event title
 * @returns Event summary string
 */
const createEventSummary = (paperCode: string, eventTitle: string): string => {
  return `${paperCode} - ${eventTitle}`;
};

/**
 * Creates event description from paper information
 * @param paperTitle Paper title
 * @param memo Optional memo
 * @returns Event description string
 */
const createEventDescription = (paperTitle: string, memo?: string): string => {
  return memo ? `${paperTitle}\n\n${memo}` : paperTitle;
};

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
  const summary = createEventSummary(paper.code, event.title);
  const description = createEventDescription(paper.title, paper.memo);
  
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
 * Formats an ICS property line
 * @param property Property name
 * @param value Property value
 * @returns Formatted ICS property line
 */
const formatIcsProperty = (property: string, value: string): string => {
  return `${property}:${value}`;
};

/**
 * Formats an ICS event as a string
 * @param event ICS event object
 * @returns ICS formatted event string
 */
export const formatIcsEvent = (event: IcsEvent): string => {
  const lines = [
    'BEGIN:VEVENT',
    formatIcsProperty('UID', event.uid),
    formatIcsProperty('DTSTAMP', getCurrentIcsTimestamp()),
    formatIcsProperty('DTSTART', event.dtstart),
    formatIcsProperty('DTEND', event.dtend),
    formatIcsProperty('SUMMARY', event.summary),
    formatIcsProperty('DESCRIPTION', event.description.replace(/\n/g, '\\n')),
    formatIcsProperty('LOCATION', event.location)
  ];
  
  if (event.rrule) {
    lines.push(formatIcsProperty('RRULE', event.rrule));
  }
  
  if (event.exdate && event.exdate.length > 0) {
    lines.push(formatIcsProperty('EXDATE', event.exdate.join(',')));
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
    formatIcsProperty('VERSION', calendar.version),
    formatIcsProperty('PRODID', calendar.prodid),
    formatIcsProperty('CALSCALE', calendar.calscale)
  ].join('\r\n');
  
  const events = calendar.events.map(formatIcsEvent).join('\r\n');
  const footer = 'END:VCALENDAR';
  
  return [header, events, footer].join('\r\n');
};

/**
 * Main conversion function
 */

/**
 * Processes a single paper and its events into ICS events
 * @param paper Paper object containing course information
 * @returns Array of ICS events
 */
const processPaperEvents = (paper: Paper): IcsEvent[] => {
  const events: IcsEvent[] = [];
  
  for (const event of paper.events) {
    try {
      const icsEvent = createIcsEvent(paper, event);
      events.push(icsEvent);
    } catch (error) {
      console.warn(`Failed to create event for ${paper.code} - ${event.title}:`, error);
    }
  }
  
  return events;
};

/**
 * Creates an ICS calendar object with default properties
 * @param events Array of ICS events
 * @returns ICS calendar object
 */
const createIcsCalendar = (events: IcsEvent[]): IcsCalendar => {
  return {
    events,
    prodid: '-//unischedule-ics//EN',
    version: '2.0',
    calscale: 'GREGORIAN'
  };
};

/**
 * Converts university course schedules into .ics calendar format
 * @param papers Array of paper objects containing course information
 * @returns ICS formatted string
 */
export const convertToIcs = (papers: Paper[]): string => {
  const allEvents = papers.flatMap(processPaperEvents);
  const calendar = createIcsCalendar(allEvents);
  return formatIcsCalendar(calendar);
};
