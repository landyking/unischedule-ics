import { Paper, PaperBreak, PaperEvent } from '../src/types';

describe('Type Definitions Tests', () => {
  test('Paper interface should accept valid data', () => {
    const paperBreak: PaperBreak = {
      title: 'Winter Break',
      startDate: '2025-12-20T00:00:00Z',
      endDate: '2025-01-15T23:59:59Z'
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
      startDate: '2025-01-01T00:00:00Z',
      endDate: '2025-12-31T23:59:59Z',
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
      startDate: '2025-01-01T00:00:00Z',
      endDate: '2025-12-31T23:59:59Z',
      breaks: [],
      events: []
    };

    expect(paper.memo).toBeUndefined();
    expect(paper.breaks).toHaveLength(0);
    expect(paper.events).toHaveLength(0);
  });
});
