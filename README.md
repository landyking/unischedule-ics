# unischedule-ics

A focused JavaScript library for converting university course schedules into .ics calendar files.
Designed for academic use cases, including lectures, labs, and tutorials with recurring weekly patterns.

## Features

- ✅ **Cross-Environment Compatibility**: Works in both frontend and backend JavaScript/TypeScript environments
- ✅ **Weekly Recurrence**: Supports weekly recurring events with RRULE
- ✅ **Break Periods**: Automatically excludes break periods using EXDATE
- ✅ **Multiple Event Types**: Handles lectures, labs, tutorials, and other event types
- ✅ **Calendar Compatibility**: Compatible with Google Calendar, Apple Calendar, and Microsoft Outlook
- ✅ **TypeScript Support**: Full TypeScript support with strict type checking

## Installation

```bash
npm install unischedule-ics
```

## Quick Start

```typescript
import { convertToIcs } from 'unischedule-ics';

const papers = [
  {
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
    memo: 'Fundamental concepts of programming',
    events: [
      {
        title: 'Lecture',
        weekday: 1, // Monday
        startTime: '09:00',
        endTime: '10:30',
        location: 'Room A101'
      },
      {
        title: 'Lab',
        weekday: 3, // Wednesday
        startTime: '14:00',
        endTime: '16:00',
        location: 'Computer Lab B'
      }
    ]
  }
];

const icsData = convertToIcs(papers);
console.log(icsData);
```

## Data Structure

### Paper Interface

```typescript
interface Paper {
  code: string;                    // Course code (e.g., "CS101")
  title: string;                   // Course title
  startDate: string;               // Course start date (ISO 8601 format, UTC)
  endDate: string;                 // Course end date (ISO 8601 format, UTC)
  breaks: PaperBreak[];            // Array of break periods
  memo?: string;                   // Optional course description
  events: PaperEvent[];            // Array of recurring events
}
```

### PaperEvent Interface

```typescript
interface PaperEvent {
  title: string;                   // Event title (e.g., "Lecture", "Lab")
  weekday: number;                 // Day of week (1-7, Monday to Sunday)
  startTime: string;               // Start time in HH:MM format (e.g., "09:00")
  endTime: string;                 // End time in HH:MM format (e.g., "10:30")
  location: string;                // Event location
}
```

### PaperBreak Interface

```typescript
interface PaperBreak {
  title: string;                   // Break title (e.g., "Mid-semester Break")
  startDate: string;               // Break start date (ISO 8601 format, UTC)
  endDate: string;                 // Break end date (ISO 8601 format, UTC)
}
```

## API Reference

### Main Functions

#### `convertToIcs(papers: Paper[]): string`

Converts an array of paper objects into an ICS calendar string.

**Parameters:**
- `papers`: Array of Paper objects containing course information

**Returns:**
- ICS formatted string ready for importing into calendar applications

### Utility Functions

The library also exports utility functions for advanced use cases:

#### Date/Time Functions
- `isoToIcsDateTime(isoDate: string): string` - Convert ISO 8601 to ICS format
- `dateTimeToIcs(date: Date, timeString: string): string` - Combine date and time
- `findFirstWeekdayOccurrence(startDate: Date, weekday: number): Date` - Find first occurrence of weekday

#### Event Creation Functions
- `createIcsEvent(paper: Paper, event: PaperEvent): IcsEvent` - Create ICS event object
- `generateEventId(paperCode: string, eventTitle: string, weekday: number, startTime: string): string` - Generate unique event ID

#### ICS Formatting Functions
- `formatIcsEvent(event: IcsEvent): string` - Format single event as ICS string
- `formatIcsCalendar(calendar: IcsCalendar): string` - Format calendar as ICS string

#### Recurrence Functions
- `generateWeeklyRRule(endDate: Date): string` - Generate weekly recurrence rule
- `generateExceptionDates(startDate: Date, endDate: Date, weekday: number, breaks: PaperBreak[]): string[]` - Generate exception dates for breaks

## Examples

### Basic Usage

```typescript
import { convertToIcs } from 'unischedule-ics';

const papers = [
  {
    code: 'MATH201',
    title: 'Calculus II',
    startDate: '2025-02-01T00:00:00Z',
    endDate: '2025-06-30T23:59:59Z',
    breaks: [],
    events: [
      {
        title: 'Lecture',
        weekday: 2, // Tuesday
        startTime: '11:00',
        endTime: '12:30',
        location: 'Lecture Hall C'
      }
    ]
  }
];

const icsString = convertToIcs(papers);
```

### Advanced Usage with Breaks

```typescript
import { convertToIcs } from 'unischedule-ics';

const papers = [
  {
    code: 'PHYS301',
    title: 'Quantum Mechanics',
    startDate: '2025-02-01T00:00:00Z',
    endDate: '2025-06-30T23:59:59Z',
    breaks: [
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
    ],
    memo: 'Advanced quantum theory course',
    events: [
      {
        title: 'Lecture',
        weekday: 1, // Monday
        startTime: '13:00',
        endTime: '14:30',
        location: 'Physics Building Room 301'
      },
      {
        title: 'Lab',
        weekday: 3, // Wednesday
        startTime: '09:00',
        endTime: '12:00',
        location: 'Physics Lab 2'
      }
    ]
  }
];

const icsString = convertToIcs(papers);
```

### Using with File System (Node.js)

```typescript
import { convertToIcs } from 'unischedule-ics';
import { writeFileSync } from 'fs';

const papers = [...]; // Your paper data

const icsData = convertToIcs(papers);
writeFileSync('university-schedule.ics', icsData);
```

### Using in Browser

```typescript
import { convertToIcs } from 'unischedule-ics';

const papers = [...]; // Your paper data

const icsData = convertToIcs(papers);
const blob = new Blob([icsData], { type: 'text/calendar' });
const url = URL.createObjectURL(blob);

// Create download link
const a = document.createElement('a');
a.href = url;
a.download = 'university-schedule.ics';
a.click();
```

## ICS Output Features

The generated ICS files include:

- **VCALENDAR**: Standard calendar container
- **VEVENT**: Individual events with:
  - Unique UIDs for each event
  - Proper date/time formatting (UTC)
  - Weekly recurrence rules (RRULE)
  - Exception dates for breaks (EXDATE)
  - Event summaries with course codes
  - Detailed descriptions including course titles and memos
  - Location information

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Development mode (watch)
npm run dev
```

## Testing

The library includes comprehensive unit tests covering:

- Date and time utility functions
- Event creation and formatting
- Recurrence rule generation
- Exception date handling
- ICS format validation
- Integration tests with real test data

Run tests with:
```bash
npm test
```

## License

MIT
