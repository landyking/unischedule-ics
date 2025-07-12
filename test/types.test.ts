import { Paper, PaperBreak, PaperEvent, IcsEvent, IcsCalendar } from '../src/types';

describe('Type Definitions Tests', () => {
  test('Paper interface should accept valid data', () => {
    const paperBreak: PaperBreak = {
      title: 'Winter Break',
      startDate: '2025-12-20',
      endDate: '2026-01-15'
    };

    const paperEvent: PaperEvent = {
      title: 'Lecture',
      weekday: 1, // Monday
      startTime: '09:00',
      endTime: '10:30',
      location: 'Room 101'
    };

    const paper: Paper = {
      code: 'CS101',
      title: 'Introduction to Computer Science',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      breaks: [paperBreak],
      memo: 'Important course',
      events: [paperEvent]
    };

    expect(paper.code).toBe('CS101');
    expect(paper.breaks).toHaveLength(1);
    expect(paper.events).toHaveLength(1);
    expect(paper.memo).toBe('Important course');
  });

  test('Paper interface should work without optional memo', () => {
    const paper: Paper = {
      code: 'MATH201',
      title: 'Calculus II',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      breaks: [],
      events: []
    };

    expect(paper.memo).toBeUndefined();
    expect(paper.breaks).toHaveLength(0);
    expect(paper.events).toHaveLength(0);
  });

  test('IcsEvent interface should accept valid data', () => {
    const icsEvent: IcsEvent = {
      uid: 'test-event@unischedule-ics',
      summary: 'Test Event',
      description: 'Test Description',
      location: 'Test Location',
      dtstart: '20250101T090000',
      dtend: '20250101T100000',
      rrule: 'FREQ=WEEKLY;UNTIL=20251231T235959',
      exdate: ['20250405T090000', '20250412T090000']
    };

    expect(icsEvent.uid).toBe('test-event@unischedule-ics');
    expect(icsEvent.rrule).toBe('FREQ=WEEKLY;UNTIL=20251231T235959');
    expect(icsEvent.exdate).toHaveLength(2);
  });

  test('IcsEvent interface should work without optional properties', () => {
    const icsEvent: IcsEvent = {
      uid: 'test-event@unischedule-ics',
      summary: 'Test Event',
      description: 'Test Description',
      location: 'Test Location',
      dtstart: '20250101T090000',
      dtend: '20250101T100000'
    };

    expect(icsEvent.rrule).toBeUndefined();
    expect(icsEvent.exdate).toBeUndefined();
  });

  test('IcsCalendar interface should accept valid data', () => {
    const icsCalendar: IcsCalendar = {
      events: [],
      prodid: '-//unischedule-ics//EN',
      version: '2.0',
      calscale: 'GREGORIAN'
    };

    expect(icsCalendar.events).toHaveLength(0);
    expect(icsCalendar.prodid).toBe('-//unischedule-ics//EN');
    expect(icsCalendar.version).toBe('2.0');
    expect(icsCalendar.calscale).toBe('GREGORIAN');
  });
});
