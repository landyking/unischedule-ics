import { helloWorld, convertToIcs } from '../src/converter';
import { Paper } from '../src/types';

describe('Hello World Tests', () => {
  test('helloWorld should return greeting message', () => {
    const result = helloWorld();
    expect(result).toBe('Hello World from unischedule-ics!');
  });

  test('convertToIcs should return valid ICS format', () => {
    const mockPaper: Paper = {
      code: 'TEST101',
      title: 'Test Paper',
      startDate: '2025-01-01T00:00:00Z',
      endDate: '2025-12-31T23:59:59Z',
      breaks: [],
      events: []
    };

    const result = convertToIcs([mockPaper]);
    
    expect(result).toContain('BEGIN:VCALENDAR');
    expect(result).toContain('END:VCALENDAR');
    expect(result).toContain('Hello World - University Schedule');
  });

  test('convertToIcs should handle empty papers array', () => {
    const result = convertToIcs([]);
    
    expect(result).toContain('BEGIN:VCALENDAR');
    expect(result).toContain('END:VCALENDAR');
    expect(result).toContain('VERSION:2.0');
  });
});
