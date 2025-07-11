import { Paper } from './types';

/**
 * Converts university course schedules into .ics calendar format
 * @param papers Array of paper objects containing course information
 * @returns ICS formatted string
 */
export const convertToIcs = (papers: Paper[]): string => {
  // Hello world implementation - basic ICS structure
  const icsHeader = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//unischedule-ics//EN',
    'CALSCALE:GREGORIAN',
  ].join('\r\n');

  const icsFooter = 'END:VCALENDAR';

  // Simple hello world event
  const helloWorldEvent = [
    'BEGIN:VEVENT',
    'UID:hello-world@unischedule-ics',
    'DTSTAMP:20250712T000000Z',
    'DTSTART:20250712T090000Z',
    'DTEND:20250712T100000Z',
    'SUMMARY:Hello World - University Schedule',
    'DESCRIPTION:Welcome to unischedule-ics!',
    'END:VEVENT',
  ].join('\r\n');

  return [icsHeader, helloWorldEvent, icsFooter].join('\r\n');
};

/**
 * Hello world function for the library
 * @returns Greeting message
 */
export const helloWorld = (): string => {
  return 'Hello World from unischedule-ics!';
};
