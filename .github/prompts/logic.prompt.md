Start generating TypeScript code that provides multiple methods to convert paper data (in JSON format) to ICS (iCalendar) text.
The code should meet the following requirements:

1. Cross-Environment Compatibility
All methods must work in both frontend and backend JavaScript/TypeScript environments.

2. Input & Output
   - Input: JSON containing multiple "paper" entries. We have a test data file `test/test-data.json`.
   - Output: A single ICS string that includes multiple calendar events.

3. Code Structure
   - Split the logic into multiple small, clear, and reusable methods.
   - Write unit tests for all core methods before implementing the final output logic.

4. Event Logic
   - Each paper includes a start date, end date, and one or more weekdays on which the events occur.
   - If a paper includes break periods, events must skip all matching weekdays within those break ranges.

5. ICS Features
   - Use ICS features like weekly recurrence to represent repeating events.
   - Use exclusion rules to skip break dates.
   - Ensure that the resulting ICS file is compatible with major calendar platforms such as Google Calendar, Apple Calendar, and Microsoft Outlook.
