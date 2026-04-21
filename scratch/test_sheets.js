const { google } = require('googleapis');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function testSheets() {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

    console.log('Attempting to fetch spreadsheet info...');
    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    console.log('Title:', meta.data.properties.title);
    
    const sheetNames = meta.data.sheets.map(s => s.properties.title);
    console.log('Available sheets:', sheetNames);

    const targetSheet = 'Khách hàng';
    if (!sheetNames.includes(targetSheet)) {
      console.error(`ERROR: Sheet "${targetSheet}" not found!`);
    } else {
      console.log(`SUCCESS: Sheet "${targetSheet}" found.`);
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${targetSheet}!A1:P1`,
      });
      console.log('Headers:', res.data.values);
    }
  } catch (err) {
    console.error('FAILED:', err.message);
  }
}

testSheets();
