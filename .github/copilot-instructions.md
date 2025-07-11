# GitHub Copilot Instructions for unischedule-ics

## Project Overview
A focused JavaScript library for converting university course schedules into .ics calendar files.
Designed for academic use cases, including lectures, labs, and tutorials with recurring weekly patterns.

## Development Guidelines

### TypeScript Standards
- **Strict mode is enabled** - maintain type safety at all times
- Use explicit types for function parameters and return values
- Prefer interfaces over types for object shapes
- Use generics for reusable components and functions
- Avoid `any` type - use `unknown` or proper typing instead

### Code Style Preferences
- Use arrow functions for inline functions and callbacks
- Use async/await over Promise chains
- Prefer const over let, never use var
- Use template literals for string interpolation
- Keep functions small and focused (single responsibility)
- Use descriptive variable and function names

## Naming Conventions
- **Functions**: camelCase (e.g., `fetchPapers`, `handleSubmit`)
- **Variables**: camelCase (e.g., `paperData`, `isLoading`)
- **Interfaces**: PascalCase with descriptive names (e.g., `Paper`, `ApiResponse`)

## Data Models
Expected data structures for this library:

```typescript

interface PaperBreak{
    title: string,
    startDate: string, // ISO 8601 format, use UTC
    endDate: string, // ISO 8601 format, use UTC
}

interface PaperEvent{
    title: string,
    weekday: number; // use 1-7 (Monday to Sunday)
    startTime: string; // use HH:MM format (e.g., "09:00" for 9:00 AM, "14:00" for 2:00 PM)
    endTime: string; // use HH:MM format (e.g., "09:00" for 9:00 AM, "14:00" for 2:00 PM)
    location: string;
}

interface Paper {
  code: string;
  title: string;
  startDate: string; // ISO 8601 format, use UTC
  endDate: string; // ISO 8601 format, use UTC
  breaks: PaperBreak[]; 
  memo?: string
  events: PaperEvent[];
}
```

## Error Handling
- Always wrap async operations in try-catch blocks
- Provide meaningful error messages to users
- Log errors for debugging but don't expose sensitive information

## Testing Approach
- Write unit tests for utility functions
- Use TypeScript's type checking as a first line of defense

## Security
- Validate all input data
