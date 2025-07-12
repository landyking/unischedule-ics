import { convertToIcs, parseSimpleDate, dateTimeToIcs, findFirstWeekdayOccurrence } from '../src/converter';
import { Paper, PaperBreak, PaperEvent } from '../src/types';

describe('Input Validation and Error Handling', () => {
  describe('Invalid Date Formats', () => {
    test('parseSimpleDate should handle invalid date strings gracefully', () => {
      // These will create invalid dates but shouldn't crash
      expect(() => parseSimpleDate('invalid-date')).not.toThrow();
      expect(() => parseSimpleDate('2025-13-01')).not.toThrow(); // Invalid month
      expect(() => parseSimpleDate('2025-02-30')).not.toThrow(); // Invalid day for February
    });

    test('parseSimpleDate should handle edge date values', () => {
      // These are technically valid but edge cases
      const feb29NonLeap = parseSimpleDate('2025-02-29'); // Non-leap year
      expect(feb29NonLeap.getMonth()).toBe(2); // JavaScript will roll over to March
      expect(feb29NonLeap.getDate()).toBe(1); // March 1st
    });
  });

  describe('Invalid Time Formats', () => {
    test('dateTimeToIcs should handle invalid time strings', () => {
      const date = new Date(2025, 0, 1);
      
      // These should not crash but may produce unexpected results
      expect(() => dateTimeToIcs(date, '25:00')).not.toThrow(); // Invalid hour
      expect(() => dateTimeToIcs(date, '12:60')).not.toThrow(); // Invalid minute
      expect(() => dateTimeToIcs(date, 'invalid')).not.toThrow(); // Invalid format
    });

    test('dateTimeToIcs should handle edge time values', () => {
      const date = new Date(2025, 0, 1);
      
      // Test with single digit hours/minutes
      const result1 = dateTimeToIcs(date, '9:5');
      expect(result1).toBe('20250101T090500');
      
      // Test with leading zeros
      const result2 = dateTimeToIcs(date, '09:05');
      expect(result2).toBe('20250101T090500');
    });
  });

  describe('Invalid Weekday Values', () => {
    test('findFirstWeekdayOccurrence should handle invalid weekday numbers', () => {
      const date = new Date(2025, 0, 1);
      
      // These should not crash but may produce unexpected results
      expect(() => findFirstWeekdayOccurrence(date, 0)).not.toThrow(); // Invalid (Sunday should be 7)
      expect(() => findFirstWeekdayOccurrence(date, 8)).not.toThrow(); // Invalid (out of range)
      expect(() => findFirstWeekdayOccurrence(date, -1)).not.toThrow(); // Invalid (negative)
    });
  });

  describe('Empty and Null Inputs', () => {
    test('convertToIcs should handle empty paper arrays', () => {
      const result = convertToIcs([]);
      expect(result).toContain('BEGIN:VCALENDAR');
      expect(result).toContain('END:VCALENDAR');
      expect(result).not.toContain('BEGIN:VEVENT');
    });

    test('convertToIcs should handle papers with empty events', () => {
      const paper: Paper = {
        code: 'EMPTY101',
        title: 'Empty Course',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        breaks: [],
        events: []
      };

      const result = convertToIcs([paper]);
      expect(result).toContain('BEGIN:VCALENDAR');
      expect(result).toContain('END:VCALENDAR');
      expect(result).not.toContain('BEGIN:VEVENT');
    });

    test('convertToIcs should handle papers with empty breaks', () => {
      const paper: Paper = {
        code: 'NOBREAK101',
        title: 'No Break Course',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        breaks: [], // Empty breaks
        events: [
          {
            title: 'Lecture',
            weekday: 1,
            startTime: '09:00',
            endTime: '10:30',
            location: 'Room 101'
          }
        ]
      };

      const result = convertToIcs([paper]);
      expect(result).toContain('BEGIN:VEVENT');
      expect(result).not.toContain('EXDATE:'); // No exception dates
    });
  });

  describe('Extreme Date Ranges', () => {
    test('convertToIcs should handle very long course duration', () => {
      const paper: Paper = {
        code: 'LONG101',
        title: 'Very Long Course',
        startDate: '2025-01-01',
        endDate: '2030-12-31', // 6 years
        breaks: [],
        events: [
          {
            title: 'Lecture',
            weekday: 1,
            startTime: '09:00',
            endTime: '10:30',
            location: 'Room 101'
          }
        ]
      };

      const result = convertToIcs([paper]);
      expect(result).toContain('BEGIN:VEVENT');
      expect(result).toContain('UNTIL=20301231T235959');
    });

    test('convertToIcs should handle very short course duration', () => {
      const paper: Paper = {
        code: 'SHORT101',
        title: 'Very Short Course',
        startDate: '2025-01-01',
        endDate: '2025-01-07', // 1 week
        breaks: [],
        events: [
          {
            title: 'Lecture',
            weekday: 1,
            startTime: '09:00',
            endTime: '10:30',
            location: 'Room 101'
          }
        ]
      };

      const result = convertToIcs([paper]);
      expect(result).toContain('BEGIN:VEVENT');
      expect(result).toContain('UNTIL=20250107T235959');
    });

    test('convertToIcs should handle course with end date before start date', () => {
      const paper: Paper = {
        code: 'REVERSE101',
        title: 'Reverse Date Course',
        startDate: '2025-12-31',
        endDate: '2025-01-01', // End before start
        breaks: [],
        events: [
          {
            title: 'Lecture',
            weekday: 1,
            startTime: '09:00',
            endTime: '10:30',
            location: 'Room 101'
          }
        ]
      };

      // Should not crash, but may produce unexpected behavior
      expect(() => convertToIcs([paper])).not.toThrow();
    });
  });

  describe('Complex Break Scenarios', () => {
    test('convertToIcs should handle breaks that span entire course duration', () => {
      const paper: Paper = {
        code: 'FULLBREAK101',
        title: 'Full Break Course',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        breaks: [
          {
            title: 'Full Year Break',
            startDate: '2025-01-01',
            endDate: '2025-12-31' // Same as course duration
          }
        ],
        events: [
          {
            title: 'Lecture',
            weekday: 1,
            startTime: '09:00',
            endTime: '10:30',
            location: 'Room 101'
          }
        ]
      };

      const result = convertToIcs([paper]);
      expect(result).toContain('BEGIN:VEVENT');
      expect(result).toContain('EXDATE:'); // Should have many exception dates
    });

    test('convertToIcs should handle breaks outside course duration', () => {
      const paper: Paper = {
        code: 'OUTBREAKS101',
        title: 'Outside Breaks Course',
        startDate: '2025-06-01',
        endDate: '2025-08-31',
        breaks: [
          {
            title: 'Before Course Break',
            startDate: '2025-01-01',
            endDate: '2025-01-31' // Before course starts
          },
          {
            title: 'After Course Break',
            startDate: '2025-10-01',
            endDate: '2025-10-31' // After course ends
          }
        ],
        events: [
          {
            title: 'Lecture',
            weekday: 1,
            startTime: '09:00',
            endTime: '10:30',
            location: 'Room 101'
          }
        ]
      };

      const result = convertToIcs([paper]);
      expect(result).toContain('BEGIN:VEVENT');
      // Should not have exception dates for breaks outside course duration
    });
  });

  describe('Large Dataset Performance', () => {
    test('convertToIcs should handle many papers efficiently', () => {
      const papers: Paper[] = Array.from({ length: 100 }, (_, i) => ({
        code: `COURSE${i + 1}`,
        title: `Course ${i + 1}`,
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        breaks: [],
        events: [
          {
            title: 'Lecture',
            weekday: 1,
            startTime: '09:00',
            endTime: '10:30',
            location: `Room ${i + 1}`
          }
        ]
      }));

      const startTime = Date.now();
      const result = convertToIcs(papers);
      const endTime = Date.now();

      expect(result).toContain('BEGIN:VCALENDAR');
      expect(result).toContain('END:VCALENDAR');
      expect(endTime - startTime).toBeLessThan(5000); // Should complete in under 5 seconds
    });

    test('convertToIcs should handle many events per paper', () => {
      const events: PaperEvent[] = Array.from({ length: 50 }, (_, i) => ({
        title: `Event ${i + 1}`,
        weekday: (i % 7) + 1, // Cycle through weekdays
        startTime: `${9 + (i % 8)}:00`, // Various times
        endTime: `${10 + (i % 8)}:30`,
        location: `Room ${i + 1}`
      }));

      const paper: Paper = {
        code: 'MANYEVENTS101',
        title: 'Many Events Course',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        breaks: [],
        events
      };

      const result = convertToIcs([paper]);
      expect(result).toContain('BEGIN:VCALENDAR');
      expect(result).toContain('END:VCALENDAR');
      
      // Count the number of VEVENT blocks
      const eventCount = (result.match(/BEGIN:VEVENT/g) || []).length;
      expect(eventCount).toBe(50);
    });
  });
});
