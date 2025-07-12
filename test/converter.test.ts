import {
  helloWorld,
  convertToIcs,
  isoToIcsDateTime,
  dateTimeToIcs,
  findFirstWeekdayOccurrence,
  generateEventId,
  generateWeeklyRRule,
  generateExceptionDates,
  createIcsEvent,
  formatIcsEvent,
  formatIcsCalendar
} from '../src/converter';
import { Paper, PaperBreak, PaperEvent, IcsEvent, IcsCalendar } from '../src/types';

const testData = require('./test-data.json');

describe('Date and Time Utility Functions', () => {
  test('isoToIcsDateTime should convert ISO 8601 to ICS format', () => {
    const isoDate = '2025-02-01T09:00:00Z';
    const result = isoToIcsDateTime(isoDate);
    expect(result).toBe('20250201T090000Z');
  });

  test('dateTimeToIcs should combine date and time to ICS format', () => {
    const date = new Date('2025-02-01T00:00:00Z');
    const timeString = '09:00';
    const result = dateTimeToIcs(date, timeString);
    expect(result).toBe('20250201T090000Z');
  });

  test('findFirstWeekdayOccurrence should find correct weekday', () => {
    // 2025-02-01 is a Saturday (day 6)
    const startDate = new Date('2025-02-01T00:00:00Z');
    
    // Find first Monday (day 1)
    const mondayResult = findFirstWeekdayOccurrence(startDate, 1);
    expect(mondayResult.getDay()).toBe(1); // Monday
    expect(mondayResult.getDate()).toBe(3); // February 3rd, 2025
    
    // Find first Wednesday (day 3)
    const wednesdayResult = findFirstWeekdayOccurrence(startDate, 3);
    expect(wednesdayResult.getDay()).toBe(3); // Wednesday
    expect(wednesdayResult.getDate()).toBe(5); // February 5th, 2025
  });

  test('generateEventId should create unique identifiers', () => {
    const id1 = generateEventId('CS101', 'Lecture', 1, '09:00');
    const id2 = generateEventId('CS101', 'Lecture', 1, '09:00');
    
    expect(id1).toContain('CS101-Lecture-1-0900');
    expect(id2).toContain('CS101-Lecture-1-0900');
    expect(id1).not.toBe(id2); // Should be unique due to timestamp and random suffix
  });
});

describe('ICS Recurrence and Exclusion Functions', () => {
  test('generateWeeklyRRule should create correct recurrence rule', () => {
    const endDate = new Date('2025-06-30T23:59:59Z');
    const result = generateWeeklyRRule(endDate);
    expect(result).toBe('FREQ=WEEKLY;UNTIL=20250630T235959Z');
  });

  test('generateExceptionDates should find dates in break periods', () => {
    const startDate = new Date('2025-02-01T00:00:00Z');
    const endDate = new Date('2025-06-30T23:59:59Z');
    const weekday = 1; // Monday
    
    const breaks: PaperBreak[] = [
      {
        title: 'Mid-semester Break',
        startDate: '2025-04-01T00:00:00Z',
        endDate: '2025-04-07T23:59:59Z'
      }
    ];
    
    const result = generateExceptionDates(startDate, endDate, weekday, breaks);
    expect(result).toContain('20250407'); // April 7th, 2025 is a Monday
  });

  test('generateExceptionDates should handle multiple breaks', () => {
    const startDate = new Date('2025-02-01T00:00:00Z');
    const endDate = new Date('2025-06-30T23:59:59Z');
    const weekday = 1; // Monday
    
    const breaks: PaperBreak[] = [
      {
        title: 'Mid-semester Break',
        startDate: '2025-04-01T00:00:00Z',
        endDate: '2025-04-07T23:59:59Z'
      },
      {
        title: 'Easter Break',
        startDate: '2025-04-17T00:00:00Z',
        endDate: '2025-04-21T23:59:59Z'
      }
    ];
    
    const result = generateExceptionDates(startDate, endDate, weekday, breaks);
    expect(result.length).toBeGreaterThan(0);
    expect(result).toContain('20250407'); // April 7th, 2025 is a Monday
    expect(result).toContain('20250421'); // April 21st, 2025 is a Monday
  });
});

describe('Event Creation Functions', () => {
  test('createIcsEvent should create valid ICS event', () => {
    const paper: Paper = {
      code: 'CS101',
      title: 'Introduction to Computer Science',
      startDate: '2025-02-01T00:00:00Z',
      endDate: '2025-06-30T23:59:59Z',
      breaks: [],
      memo: 'Fundamental concepts of programming',
      events: []
    };

    const event: PaperEvent = {
      title: 'Lecture',
      weekday: 1, // Monday
      startTime: '09:00',
      endTime: '10:30',
      location: 'Room A101'
    };

    const result = createIcsEvent(paper, event);
    
    expect(result.summary).toBe('CS101 - Lecture');
    expect(result.description).toContain('Introduction to Computer Science');
    expect(result.description).toContain('Fundamental concepts of programming');
    expect(result.location).toBe('Room A101');
    expect(result.rrule).toContain('FREQ=WEEKLY');
    expect(result.uid).toContain('CS101-Lecture-1-0900');
  });

  test('createIcsEvent should handle events without memo', () => {
    const paper: Paper = {
      code: 'MATH201',
      title: 'Calculus II',
      startDate: '2025-02-01T00:00:00Z',
      endDate: '2025-06-30T23:59:59Z',
      breaks: [],
      events: []
    };

    const event: PaperEvent = {
      title: 'Tutorial',
      weekday: 4, // Thursday
      startTime: '15:00',
      endTime: '16:00',
      location: 'Room D205'
    };

    const result = createIcsEvent(paper, event);
    
    expect(result.summary).toBe('MATH201 - Tutorial');
    expect(result.description).toBe('Calculus II');
    expect(result.location).toBe('Room D205');
  });

  test('createIcsEvent should include exception dates for breaks', () => {
    const paper: Paper = {
      code: 'CS101',
      title: 'Introduction to Computer Science',
      startDate: '2025-02-01T00:00:00Z',
      endDate: '2025-06-30T23:59:59Z',
      breaks: [
        {
          title: 'Mid-semester Break',
          startDate: '2025-04-01T00:00:00Z',
          endDate: '2025-04-07T23:59:59Z'
        }
      ],
      events: []
    };

    const event: PaperEvent = {
      title: 'Lecture',
      weekday: 1, // Monday
      startTime: '09:00',
      endTime: '10:30',
      location: 'Room A101'
    };

    const result = createIcsEvent(paper, event);
    
    expect(result.exdate).toBeDefined();
    expect(result.exdate!.length).toBeGreaterThan(0);
  });
});

describe('ICS Formatting Functions', () => {
  test('formatIcsEvent should create valid ICS event string', () => {
    const event: IcsEvent = {
      uid: 'test-event@unischedule-ics',
      summary: 'Test Event',
      description: 'Test Description',
      location: 'Test Location',
      dtstart: '20250201T090000Z',
      dtend: '20250201T103000Z',
      rrule: 'FREQ=WEEKLY;UNTIL=20250630T235959Z'
    };

    const result = formatIcsEvent(event);
    
    expect(result).toContain('BEGIN:VEVENT');
    expect(result).toContain('END:VEVENT');
    expect(result).toContain('UID:test-event@unischedule-ics');
    expect(result).toContain('SUMMARY:Test Event');
    expect(result).toContain('DESCRIPTION:Test Description');
    expect(result).toContain('LOCATION:Test Location');
    expect(result).toContain('DTSTART:20250201T090000Z');
    expect(result).toContain('DTEND:20250201T103000Z');
    expect(result).toContain('RRULE:FREQ=WEEKLY;UNTIL=20250630T235959Z');
  });

  test('formatIcsEvent should handle events with exception dates', () => {
    const event: IcsEvent = {
      uid: 'test-event@unischedule-ics',
      summary: 'Test Event',
      description: 'Test Description',
      location: 'Test Location',
      dtstart: '20250201T090000Z',
      dtend: '20250201T103000Z',
      rrule: 'FREQ=WEEKLY;UNTIL=20250630T235959Z',
      exdate: ['20250407', '20250421']
    };

    const result = formatIcsEvent(event);
    
    expect(result).toContain('EXDATE:20250407,20250421');
  });

  test('formatIcsCalendar should create valid ICS calendar string', () => {
    const calendar: IcsCalendar = {
      events: [],
      prodid: '-//unischedule-ics//EN',
      version: '2.0',
      calscale: 'GREGORIAN'
    };

    const result = formatIcsCalendar(calendar);
    
    expect(result).toContain('BEGIN:VCALENDAR');
    expect(result).toContain('END:VCALENDAR');
    expect(result).toContain('VERSION:2.0');
    expect(result).toContain('PRODID:-//unischedule-ics//EN');
    expect(result).toContain('CALSCALE:GREGORIAN');
  });
});

describe('Main Conversion Function', () => {
  test('convertToIcs should convert test data to valid ICS format', () => {
    const result = convertToIcs(testData.papers);
    
    expect(result).toContain('BEGIN:VCALENDAR');
    expect(result).toContain('END:VCALENDAR');
    expect(result).toContain('VERSION:2.0');
    expect(result).toContain('PRODID:-//unischedule-ics//EN');
    expect(result).toContain('CALSCALE:GREGORIAN');
    
    // Should contain events from test data
    expect(result).toContain('CS101 - Lecture');
    expect(result).toContain('CS101 - Lab');
    expect(result).toContain('MATH201 - Lecture');
    expect(result).toContain('MATH201 - Tutorial');
    expect(result).toContain('PHYS301 - Lecture');
    expect(result).toContain('PHYS301 - Lab');
    
    // Should contain recurrence rules
    expect(result).toContain('FREQ=WEEKLY');
    
    // Should contain exception dates for breaks
    expect(result).toContain('EXDATE:');
  });

  test('convertToIcs should handle empty papers array', () => {
    const result = convertToIcs([]);
    
    expect(result).toContain('BEGIN:VCALENDAR');
    expect(result).toContain('END:VCALENDAR');
    expect(result).toContain('VERSION:2.0');
    expect(result).toContain('PRODID:-//unischedule-ics//EN');
    expect(result).toContain('CALSCALE:GREGORIAN');
  });

  test('convertToIcs should handle papers with no events', () => {
    const paper: Paper = {
      code: 'TEST101',
      title: 'Test Paper',
      startDate: '2025-01-01T00:00:00Z',
      endDate: '2025-12-31T23:59:59Z',
      breaks: [],
      events: []
    };

    const result = convertToIcs([paper]);
    
    expect(result).toContain('BEGIN:VCALENDAR');
    expect(result).toContain('END:VCALENDAR');
    expect(result).not.toContain('BEGIN:VEVENT');
  });
});

describe('Legacy Tests', () => {
  test('helloWorld should return greeting message', () => {
    const result = helloWorld();
    expect(result).toBe('Hello World from unischedule-ics!');
  });
});
