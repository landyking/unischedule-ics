import { convertToIcs } from '../src/converter';
import { Paper } from '../src/types';

describe('Integration and Real-World Scenarios', () => {
  describe('Common University Scenarios', () => {
    test('should handle typical computer science course schedule', () => {
      const paper: Paper = {
        code: 'COMP101',
        title: 'Introduction to Programming',
        startDate: '2025-02-17', // Monday start
        endDate: '2025-06-13',   // Friday end
        breaks: [
          {
            title: 'Mid-semester Break',
            startDate: '2025-04-14',
            endDate: '2025-04-25'
          },
          {
            title: 'ANZAC Day',
            startDate: '2025-04-25',
            endDate: '2025-04-25'
          }
        ],
        memo: 'Bring laptop to all sessions. Programming assignments due weekly.',
        events: [
          {
            title: 'Lecture',
            weekday: 1, // Monday
            startTime: '09:00',
            endTime: '10:00',
            location: 'Lecture Theatre A'
          },
          {
            title: 'Lecture',
            weekday: 3, // Wednesday
            startTime: '09:00',
            endTime: '10:00',
            location: 'Lecture Theatre A'
          },
          {
            title: 'Tutorial',
            weekday: 2, // Tuesday
            startTime: '14:00',
            endTime: '15:00',
            location: 'Computer Lab 1'
          },
          {
            title: 'Lab',
            weekday: 4, // Thursday
            startTime: '15:00',
            endTime: '17:00',
            location: 'Computer Lab 2'
          }
        ]
      };

      const result = convertToIcs([paper]);
      
      expect(result).toContain('COMP101 - Lecture');
      expect(result).toContain('COMP101 - Tutorial');
      expect(result).toContain('COMP101 - Lab');
      expect(result).toContain('Bring laptop to all sessions');
      expect(result).toContain('FREQ=WEEKLY');
      expect(result).toContain('UNTIL=20250613T235959');
      expect(result).toContain('EXDATE:');
    });

    test('should handle intensive block course format', () => {
      const paper: Paper = {
        code: 'WORKSHOP501',
        title: 'Intensive Research Methods Workshop',
        startDate: '2025-07-01',
        endDate: '2025-07-05', // 1 week intensive
        breaks: [],
        memo: 'Attendance is mandatory for all sessions.',
        events: [
          {
            title: 'Morning Session',
            weekday: 1, // Monday
            startTime: '09:00',
            endTime: '12:00',
            location: 'Seminar Room 1'
          },
          {
            title: 'Afternoon Session',
            weekday: 1, // Monday
            startTime: '13:00',
            endTime: '16:00',
            location: 'Seminar Room 1'
          },
          {
            title: 'Morning Session',
            weekday: 2, // Tuesday
            startTime: '09:00',
            endTime: '12:00',
            location: 'Seminar Room 1'
          },
          {
            title: 'Afternoon Session',
            weekday: 2, // Tuesday
            startTime: '13:00',
            endTime: '16:00',
            location: 'Seminar Room 1'
          },
          {
            title: 'Morning Session',
            weekday: 3, // Wednesday
            startTime: '09:00',
            endTime: '12:00',
            location: 'Seminar Room 1'
          },
          {
            title: 'Afternoon Session',
            weekday: 3, // Wednesday
            startTime: '13:00',
            endTime: '16:00',
            location: 'Seminar Room 1'
          },
          {
            title: 'Morning Session',
            weekday: 4, // Thursday
            startTime: '09:00',
            endTime: '12:00',
            location: 'Seminar Room 1'
          },
          {
            title: 'Afternoon Session',
            weekday: 4, // Thursday
            startTime: '13:00',
            endTime: '16:00',
            location: 'Seminar Room 1'
          },
          {
            title: 'Final Presentations',
            weekday: 5, // Friday
            startTime: '09:00',
            endTime: '15:00',
            location: 'Seminar Room 1'
          }
        ]
      };

      const result = convertToIcs([paper]);
      
      expect(result).toContain('WORKSHOP501 - Morning Session');
      expect(result).toContain('WORKSHOP501 - Afternoon Session');
      expect(result).toContain('WORKSHOP501 - Final Presentations');
      expect(result).toContain('UNTIL=20250705T235959');
      
      // Count the number of events
      const eventCount = (result.match(/BEGIN:VEVENT/g) || []).length;
      expect(eventCount).toBe(9);
    });

    test('should handle mixed postgraduate and undergraduate schedule', () => {
      const papers: Paper[] = [
        {
          code: 'UNDERGRAD201',
          title: 'Statistics for Social Sciences',
          startDate: '2025-02-17',
          endDate: '2025-06-13',
          breaks: [
            {
              title: 'Mid-semester Break',
              startDate: '2025-04-14',
              endDate: '2025-04-25'
            }
          ],
          events: [
            {
              title: 'Lecture',
              weekday: 2,
              startTime: '10:00',
              endTime: '11:00',
              location: 'Lecture Hall B'
            },
            {
              title: 'Tutorial',
              weekday: 4,
              startTime: '13:00',
              endTime: '14:00',
              location: 'Tutorial Room 5'
            }
          ]
        },
        {
          code: 'POSTGRAD701',
          title: 'Advanced Research Methodology',
          startDate: '2025-02-17',
          endDate: '2025-06-13',
          breaks: [
            {
              title: 'Mid-semester Break',
              startDate: '2025-04-14',
              endDate: '2025-04-25'
            },
            {
              title: 'Conference Week',
              startDate: '2025-05-12',
              endDate: '2025-05-16'
            }
          ],
          memo: 'Seminar-style classes with student presentations',
          events: [
            {
              title: 'Seminar',
              weekday: 1,
              startTime: '18:00',
              endTime: '21:00',
              location: 'Postgrad Seminar Room'
            }
          ]
        }
      ];

      const result = convertToIcs(papers);
      
      expect(result).toContain('UNDERGRAD201 - Lecture');
      expect(result).toContain('UNDERGRAD201 - Tutorial');
      expect(result).toContain('POSTGRAD701 - Seminar');
      expect(result).toContain('Seminar-style classes');
      
      // Should have events from both courses
      const eventCount = (result.match(/BEGIN:VEVENT/g) || []).length;
      expect(eventCount).toBe(3);
    });

    test('should handle international university with different calendar', () => {
      const paper: Paper = {
        code: 'INTL301',
        title: 'International Business Studies',
        startDate: '2025-09-01', // September start (European style)
        endDate: '2025-12-20',   // December end
        breaks: [
          {
            title: 'Reading Week',
            startDate: '2025-10-26',
            endDate: '2025-11-01'
          },
          {
            title: 'Thanksgiving Break',
            startDate: '2025-11-24',
            endDate: '2025-11-29'
          }
        ],
        memo: 'Course includes international guest speakers via video conference',
        events: [
          {
            title: 'Lecture',
            weekday: 1,
            startTime: '08:00', // Early morning
            endTime: '09:30',
            location: 'International Studies Building'
          },
          {
            title: 'Lecture',
            weekday: 4,
            startTime: '08:00',
            endTime: '09:30',
            location: 'International Studies Building'
          },
          {
            title: 'Case Study Workshop',
            weekday: 3,
            startTime: '14:00',
            endTime: '16:00',
            location: 'Business Lab'
          }
        ]
      };

      const result = convertToIcs([paper]);
      
      expect(result).toContain('INTL301 - Lecture');
      expect(result).toContain('INTL301 - Case Study Workshop');
      expect(result).toContain('UNTIL=20251220T235959');
      expect(result).toContain('international guest speakers');
      
      // Should handle multiple breaks
      const exceptionDates = result.match(/EXDATE:[^\\r\\n]+/g);
      expect(exceptionDates).toBeTruthy();
    });
  });

  describe('Special Format Courses', () => {
    test('should handle weekend executive education course', () => {
      const paper: Paper = {
        code: 'EXEC501',
        title: 'Executive Leadership Program',
        startDate: '2025-03-01',
        endDate: '2025-05-31',
        breaks: [
          {
            title: 'Easter Weekend',
            startDate: '2025-04-18',
            endDate: '2025-04-21'
          }
        ],
        memo: 'Designed for working professionals',
        events: [
          {
            title: 'Workshop',
            weekday: 6, // Saturday
            startTime: '09:00',
            endTime: '17:00',
            location: 'Executive Education Center'
          },
          {
            title: 'Networking Session',
            weekday: 6, // Saturday
            startTime: '17:30',
            endTime: '19:00',
            location: 'Executive Lounge'
          }
        ]
      };

      const result = convertToIcs([paper]);
      
      expect(result).toContain('EXEC501 - Workshop');
      expect(result).toContain('EXEC501 - Networking Session');
      expect(result).toContain('Executive Education Center');
      expect(result).toContain('working professionals');
    });

    test('should handle clinical placement course', () => {
      const paper: Paper = {
        code: 'CLINIC401',
        title: 'Clinical Psychology Placement',
        startDate: '2025-02-01',
        endDate: '2025-11-30',
        breaks: [
          {
            title: 'Mid-year Break',
            startDate: '2025-06-30',
            endDate: '2025-07-25'
          },
          {
            title: 'Professional Development Week',
            startDate: '2025-09-15',
            endDate: '2025-09-19'
          }
        ],
        memo: 'External placement at approved clinical sites. Attendance tracking required.',
        events: [
          {
            title: 'Clinical Practice',
            weekday: 1,
            startTime: '08:00',
            endTime: '17:00',
            location: 'External Clinical Site'
          },
          {
            title: 'Clinical Practice',
            weekday: 2,
            startTime: '08:00',
            endTime: '17:00',
            location: 'External Clinical Site'
          },
          {
            title: 'Clinical Practice',
            weekday: 3,
            startTime: '08:00',
            endTime: '17:00',
            location: 'External Clinical Site'
          },
          {
            title: 'Supervision Session',
            weekday: 4,
            startTime: '16:00',
            endTime: '17:00',
            location: 'University Clinic'
          },
          {
            title: 'Peer Review Meeting',
            weekday: 5,
            startTime: '14:00',
            endTime: '15:00',
            location: 'Conference Room C'
          }
        ]
      };

      const result = convertToIcs([paper]);
      
      expect(result).toContain('CLINIC401 - Clinical Practice');
      expect(result).toContain('CLINIC401 - Supervision Session');
      expect(result).toContain('CLINIC401 - Peer Review Meeting');
      expect(result).toContain('External Clinical Site');
      expect(result).toContain('Attendance tracking required');
      
      // Should handle long duration with breaks
      expect(result).toContain('UNTIL=20251130T235959');
    });
  });

  describe('ICS Format Compliance', () => {
    test('generated ICS should comply with basic RFC 5545 structure', () => {
      const paper: Paper = {
        code: 'RFC101',
        title: 'Test Course',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        breaks: [],
        events: [
          {
            title: 'Lecture',
            weekday: 1,
            startTime: '09:00',
            endTime: '10:00',
            location: 'Room 101'
          }
        ]
      };

      const result = convertToIcs([paper]);
      
      // Check basic structure
      expect(result).toMatch(/^BEGIN:VCALENDAR\r\n/);
      expect(result).toMatch(/\r\nEND:VCALENDAR$/);
      
      // Check required properties
      expect(result).toContain('VERSION:2.0');
      expect(result).toContain('PRODID:-//unischedule-ics//EN');
      expect(result).toContain('CALSCALE:GREGORIAN');
      
      // Check event structure
      expect(result).toContain('BEGIN:VEVENT');
      expect(result).toContain('END:VEVENT');
      
      // Check required event properties
      expect(result).toMatch(/UID:[^\r\n]+@unischedule-ics/);
      expect(result).toMatch(/DTSTART:\d{8}T\d{6}/);
      expect(result).toMatch(/DTEND:\d{8}T\d{6}/);
      expect(result).toMatch(/DTSTAMP:\d{8}T\d{6}/);
      expect(result).toContain('SUMMARY:');
      expect(result).toContain('DESCRIPTION:');
      expect(result).toContain('LOCATION:');
    });

    test('should properly escape special characters in ICS format', () => {
      const paper: Paper = {
        code: 'SPECIAL101',
        title: 'Test Course with "Quotes" & Symbols',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        breaks: [],
        memo: 'Description with\nNewlines\nAnd; semicolons, commas',
        events: [
          {
            title: 'Lecture',
            weekday: 1,
            startTime: '09:00',
            endTime: '10:00',
            location: 'Room "A&B"'
          }
        ]
      };

      const result = convertToIcs([paper]);
      
      // Check that newlines are properly escaped
      expect(result).toContain('\\n');
      
      // Check that quotes and special characters are preserved
      expect(result).toContain('Room "A&B"');
      expect(result).toContain('"Quotes" & Symbols');
    });

    test('should generate unique UIDs for different events', () => {
      const paper: Paper = {
        code: 'UNIQUE101',
        title: 'Test Course',
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        breaks: [],
        events: [
          {
            title: 'Lecture',
            weekday: 1,
            startTime: '09:00',
            endTime: '10:00',
            location: 'Room 101'
          },
          {
            title: 'Lecture',
            weekday: 1,
            startTime: '09:00',
            endTime: '10:00',
            location: 'Room 102'
          }
        ]
      };

      const result = convertToIcs([paper]);
      
      // Extract all UIDs
      const uids = result.match(/UID:[^\r\n]+/g) || [];
      expect(uids).toHaveLength(2);
      
      // Check that UIDs are unique
      expect(uids[0]).not.toBe(uids[1]);
      
      // Check that both UIDs contain the expected domain
      expect(uids[0]).toContain('@unischedule-ics');
      expect(uids[1]).toContain('@unischedule-ics');
    });
  });
});
