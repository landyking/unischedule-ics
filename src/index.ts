// Main entry point for the unischedule-ics library

export { Paper, PaperBreak, PaperEvent } from './types';
export { convertToIcs, helloWorld } from './converter';

// Default export
import { convertToIcs, helloWorld } from './converter';

export default {
  convertToIcs,
  helloWorld,
};