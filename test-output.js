const { convertToIcs } = require('./dist/converter');
const testData = require('./test/test-data.json');

console.log('=== Testing ICS Conversion ===');
console.log('Input papers:', testData.papers.length);

const icsOutput = convertToIcs(testData.papers);

console.log('\n=== ICS Output ===');
console.log(icsOutput);

console.log('\n=== Analysis ===');
console.log('Total lines:', icsOutput.split('\n').length);
console.log('Event count:', (icsOutput.match(/BEGIN:VEVENT/g) || []).length);
console.log('Recurrence rules:', (icsOutput.match(/RRULE:/g) || []).length);
console.log('Exception dates:', (icsOutput.match(/EXDATE:/g) || []).length);

// Save to file for inspection
const fs = require('fs');
fs.writeFileSync('./test-output.ics', icsOutput);
console.log('\nICS file saved as test-output.ics');
