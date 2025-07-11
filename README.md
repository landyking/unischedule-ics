# unischedule-ics

A focused JavaScript library for converting university course schedules into .ics calendar files.

## Installation

```bash
npm install unischedule-ics
```

## Usage

```typescript
import { convertToIcs, helloWorld } from 'unischedule-ics';
// or
import unischedule from 'unischedule-ics';

// Hello world example
console.log(helloWorld());

// Convert papers to ICS format
const papers = [
  {
    code: 'CS101',
    title: 'Introduction to Computer Science',
    startDate: '2025-01-01T00:00:00Z',
    endDate: '2025-12-31T23:59:59Z',
    breaks: [],
    events: []
  }
];

const icsData = convertToIcs(papers);
console.log(icsData);
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

## License

MIT
