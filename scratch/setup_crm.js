const { google } = require('googleapis');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function setupCrmSheet() {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

    const meta = await sheets.spreadsheets.get({ spreadsheetId });
    const sheetNames = meta.data.sheets.map(s => s.properties.title);

    if (!sheetNames.includes('CRM')) {
      console.log('Adding "CRM" sheet...');
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: { title: 'CRM' },
              },
            },
          ],
        },
      });
      console.log('Sheet "CRM" added.');
    }

    const headers = [
      'Timestamp', 'SessionID', 'Tên', 'SĐT', 'Email', 'Dịch vụ',
      'Ngày hẹn', 'Giờ hẹn', 'HotLevel', 'Score', 'Lý do AI',
      'NextAction', 'Tóm tắt', 'Trạng thái', 'Nguồn', 'FollowUpHours'
    ];

    console.log('Updating headers...');
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'CRM!A1:P1',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [headers] },
    });
    console.log('Headers updated successfully.');
  } catch (err) {
    console.error('FAILED:', err.message);
  }
}

setupCrmSheet();
