# unischedule-ics

A focused JavaScript library for converting university course schedules into .ics calendar files.
Designed for academic use cases, including lectures, labs, and tutorials with recurring weekly patterns.

## Features

- ✅ **TypeScript Support**: Full TypeScript support with strict type checking
- ✅ **Weekly Recurrence**: Supports weekly recurring events with RRULE
- ✅ **Break Periods**: Automatically excludes break periods using EXDATE
- ✅ **Multiple Event Types**: Handles lectures, labs, tutorials, and other event types
- ✅ **Calendar Compatibility**: Compatible with Google Calendar, Apple Calendar, and Microsoft Outlook
- ✅ **Cross-Environment**: Works in both frontend and backend JavaScript/TypeScript environments

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
    startDate: '2025-02-01',
    endDate: '2025-06-30',
    breaks: [
      {
        title: 'Mid-semester Break',
        startDate: '2025-04-01',
        endDate: '2025-04-07'
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
  startDate: string;               // Course start date (YYYY-MM-DD format)
  endDate: string;                 // Course end date (YYYY-MM-DD format)
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
  startDate: string;               // Break start date (YYYY-MM-DD format)
  endDate: string;                 // Break end date (YYYY-MM-DD format)
}
```

## API Reference

### Main Function

#### `convertToIcs(papers: Paper[]): string`

Converts an array of paper objects into an ICS calendar string.

**Parameters:**
- `papers`: Array of Paper objects containing course information

**Returns:**
- ICS formatted string ready for importing into calendar applications

### Usage Examples

#### Basic Usage

```typescript
import { convertToIcs } from 'unischedule-ics';

const papers = [
  {
    code: 'MATH201',
    title: 'Calculus II',
    startDate: '2025-02-01',
    endDate: '2025-06-30',
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

#### With Break Periods

```typescript
const papers = [
  {
    code: 'PHYS301',
    title: 'Quantum Mechanics',
    startDate: '2025-02-01',
    endDate: '2025-06-30',
    breaks: [
      {
        title: 'Mid-semester Break',
        startDate: '2025-04-01',
        endDate: '2025-04-07'
      },
      {
        title: 'Easter Break',
        startDate: '2025-04-17',
        endDate: '2025-04-21'
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

#### Save to File (Node.js)

```typescript
import { convertToIcs } from 'unischedule-ics';
import { writeFileSync } from 'fs';

const papers = [...]; // Your paper data

const icsData = convertToIcs(papers);
writeFileSync('university-schedule.ics', icsData);
```

#### Download in Browser

```typescript
import { convertToIcs } from 'unischedule-ics';

const papers = [...]; // Your paper data

const icsData = convertToIcs(papers);
const blob = new Blob([icsData], { type: 'text/calendar' });
const url = URL.createObjectURL(blob);

const a = document.createElement('a');
a.href = url;
a.download = 'university-schedule.ics';
a.click();
```

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

Comprehensive test coverage including:
- Date and time parsing
- Event creation and formatting
- Recurrence rule generation
- Exception date handling
- Edge cases and error handling

```bash
npm test
```

## License

MIT
