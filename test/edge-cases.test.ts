import {
  convertToIcs,
  parseSimpleDate,
  dateTimeToIcs,
  findFirstWeekdayOccurrence,
  generateExceptionDates,
  createIcsEvent,
  formatIcsEvent
} from '../src/converter';
import { Paper, PaperBreak, PaperEvent } from '../src/types';

describe('Edge Cases and Error Handling', () => {
  describe('Date Parsing Edge Cases', () => {
    test('parseSimpleDate should handle end-of-month dates', () => {
      const endOfMonth = parseSimpleDate('2025-01-31');
      expect(endOfMonth.getDate()).toBe(31);
      expect(endOfMonth.getMonth()).toBe(0); // January
    });

    test('parseSimpleDate should handle leap year dates', () => {
      const leapYear = parseSimpleDate('2024-02-29');
      expect(leapYear.getDate()).toBe(29);
      expect(leapYear.getMonth()).toBe(1); // February
    });

    test('parseSimpleDate should handle year boundaries', () => {
      const newYear = parseSimpleDate('2025-01-01');
      expect(newYear.getFullYear()).toBe(2025);
      expect(newYear.getMonth()).toBe(0);
      expect(newYear.getDate()).toBe(1);
    });
  });

  describe('Time Handling Edge Cases', () => {
    test('dateTimeToIcs should handle midnight times', () => {
      const date = new Date(2025, 0, 1);
      const result = dateTimeToIcs(date, '00:00');
      expect(result).toBe('20250101T000000');
    });

    test('dateTimeToIcs should handle late evening times', () => {
      const date = new Date(2025, 0, 1);
      const result = dateTimeToIcs(date, '23:59');
      expect(result).toBe('20250101T235900');
    });

    test('dateTimeToIcs should handle noon times', () => {
      const date = new Date(2025, 0, 1);
      const result = dateTimeToIcs(date, '12:00');
      expect(result).toBe('20250101T120000');
    });
  });

  describe('Weekday Calculation Edge Cases', () => {
    test('findFirstWeekdayOccurrence should handle Sunday start date', () => {
      // 2025-01-05 is a Sunday (day 0)
      const sundayDate = new Date(2025, 0, 5);
      
      // Find first Monday (day 1)
      const result = findFirstWeekdayOccurrence(sundayDate, 1);
      expect(result.getDay()).toBe(1); // Monday
      expect(result.getDate()).toBe(6); // January 6th
    });

    test('findFirstWeekdayOccurrence should handle same weekday', () => {
      // 2025-01-06 is a Monday (day 1)
      const mondayDate = new Date(2025, 0, 6);
      
      // Find first Monday (day 1) - should be the same day
      const result = findFirstWeekdayOccurrence(mondayDate, 1);
      expect(result.getDay()).toBe(1); // Monday
      expect(result.getDate()).toBe(6); // Same day
    });

    test('findFirstWeekdayOccurrence should handle Saturday (day 6)', () => {
      // 2025-01-01 is a Wednesday (day 3)
      const startDate = new Date(2025, 0, 1);
      
      // Find first Saturday (day 6)
      const result = findFirstWeekdayOccurrence(startDate, 6);
      expect(result.getDay()).toBe(6); // Saturday
      expect(result.getDate()).toBe(4); // January 4th
    });

    test('findFirstWeekdayOccurrence should handle Sunday (day 7)', () => {
      // 2025-01-01 is a Wednesday (day 3)
      const startDate = new Date(2025, 0, 1);
      
      // Find first Sunday (day 7)
      const result = findFirstWeekdayOccurrence(startDate, 7);
      expect(result.getDay()).toBe(0); // Sunday (JavaScript day 0)
      expect(result.getDate()).toBe(5); // January 5th
    });
  });

  describe('Exception Dates Edge Cases', () => {
    test('generateExceptionDates should handle break at course start', () => {
      const startDate = new Date(2025, 0, 6); // Monday, January 6th
      const endDate = new Date(2025, 5, 30); // June 30th
      const weekday = 1; // Monday
      const eventStartTime = '09:00';
      
      const breaks: PaperBreak[] = [
        {
          title: 'Start Break',
          startDate: '2025-01-06', // Same as start date
          endDate: '2025-01-12'
        }
      ];
      
      const result = generateExceptionDates(startDate, endDate, weekday, eventStartTime, breaks);
      expect(result).toContain('20250106T090000');
    });

    test('generateExceptionDates should handle break at course end', () => {
      const startDate = new Date(2025, 0, 6); // Monday, January 6th
      const endDate = new Date(2025, 5, 30); // Monday, June 30th
      const weekday = 1; // Monday
      const eventStartTime = '09:00';
      
      const breaks: PaperBreak[] = [
        {
          title: 'End Break',
          startDate: '2025-06-23', // Week before end
          endDate: '2025-06-30'    // Same as end date
        }
      ];
      
      const result = generateExceptionDates(startDate, endDate, weekday, eventStartTime, breaks);
      expect(result).toContain('20250623T090000');
      expect(result).toContain('20250630T090000');
    });

    test('generateExceptionDates should handle overlapping breaks', () => {
      const startDate = new Date(2025, 0, 6); // Monday, January 6th
      const endDate = new Date(2025, 5, 30); // June 30th
      const weekday = 1; // Monday
      const eventStartTime = '09:00';
      
      const breaks: PaperBreak[] = [
        {
          title: 'Break 1',
          startDate: '2025-04-07',
          endDate: '2025-04-14'
        },
        {
          title: 'Break 2',
          startDate: '2025-04-10', // Overlaps with Break 1
          endDate: '2025-04-21'
        }
      ];
      
      const result = generateExceptionDates(startDate, endDate, weekday, eventStartTime, breaks);
      expect(result).toContain('20250407T090000');
      expect(result).toContain('20250414T090000');
      expect(result).toContain('20250421T090000');
    });

    test('generateExceptionDates should handle single-day breaks', () => {
      const startDate = new Date(2025, 0, 6); // Monday, January 6th
      const endDate = new Date(2025, 5, 30); // June 30th
      const weekday = 1; // Monday
      const eventStartTime = '09:00';
      
      const breaks: PaperBreak[] = [
        {
          title: 'Public Holiday',
          startDate: '2025-04-21', // Monday
          endDate: '2025-04-21'    // Same day
        }
      ];
      
      const result = generateExceptionDates(startDate, endDate, weekday, eventStartTime, breaks);
      expect(result).toContain('20250421T090000');
    });
  });

  describe('Event Creation Edge Cases', () => {
    test('createIcsEvent should handle long course titles', () => {
      const paper: Paper = {
        code: 'LONGTITLE101',
        title: 'This is a very long course title that might cause formatting issues in calendar applications and should be handled gracefully by the ICS generator',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        breaks: [],
        events: []
      };

      const event: PaperEvent = {
        title: 'Lecture',
        weekday: 1,
        startTime: '09:00',
        endTime: '10:30',
        location: 'Room 101'
      };

      const result = createIcsEvent(paper, event);
      expect(result.summary).toBe('LONGTITLE101 - Lecture');
      expect(result.description).toContain('This is a very long course title');
    });

    test('createIcsEvent should handle special characters in titles', () => {
      const paper: Paper = {
        code: 'SPECIAL101',
        title: 'Français & Español: Chars with àccénts, ñ, and émojis 🎓',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        breaks: [],
        memo: 'Special chars: " & < > \' \n New line',
        events: []
      };

      const event: PaperEvent = {
        title: 'Lecture',
        weekday: 1,
        startTime: '09:00',
        endTime: '10:30',
        location: 'Room "A&B" <Hall>'
      };

      const result = createIcsEvent(paper, event);
      expect(result.summary).toBe('SPECIAL101 - Lecture');
      expect(result.description).toContain('Français & Español');
      expect(result.description).toContain('Special chars');
      expect(result.location).toBe('Room "A&B" <Hall>');
    });

    test('createIcsEvent should handle very long memo text', () => {
      const longMemo = 'This is a very long memo that contains multiple lines and paragraphs. '.repeat(10);
      
      const paper: Paper = {
        code: 'MEMO101',
        title: 'Test Course',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        breaks: [],
        memo: longMemo,
        events: []
      };

      const event: PaperEvent = {
        title: 'Lecture',
        weekday: 1,
        startTime: '09:00',
        endTime: '10:30',
        location: 'Room 101'
      };

      const result = createIcsEvent(paper, event);
      expect(result.description).toContain(longMemo);
    });
  });

  describe('ICS Formatting Edge Cases', () => {
    test('formatIcsEvent should handle newlines in description', () => {
      const event = {
        uid: 'test@unischedule-ics',
        summary: 'Test Event',
        description: 'Line 1\nLine 2\nLine 3',
        location: 'Room 101',
        dtstart: '20250101T090000',
        dtend: '20250101T103000'
      };

      const result = formatIcsEvent(event);
      expect(result).toContain('DESCRIPTION:Line 1\\nLine 2\\nLine 3');
    });

    test('formatIcsEvent should handle events with many exception dates', () => {
      const manyExceptionDates = Array.from({ length: 20 }, (_, i) => 
        `2025${String(i + 1).padStart(2, '0')}01T090000`
      );

      const event = {
        uid: 'test@unischedule-ics',
        summary: 'Test Event',
        description: 'Test Description',
        location: 'Room 101',
        dtstart: '20250101T090000',
        dtend: '20250101T103000',
        rrule: 'FREQ=WEEKLY;UNTIL=20251231T235959',
        exdate: manyExceptionDates
      };

      const result = formatIcsEvent(event);
      expect(result).toContain('EXDATE:');
      expect(result).toContain(manyExceptionDates.join(','));
    });
  });
});
