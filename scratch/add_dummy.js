const { google } = require('googleapis');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function addDummyLead() {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

    const timestamp = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    const dummyLead = [
      timestamp,
      'test-session-001',
      'Nguyễn Văn Test',
      '0987654321',
      'test@example.com',
      'Facial Treatment',
      '25/04/2026',
      '10:00',
      'HOT',
      95,
      'Khách hàng cực kỳ quan tâm, muốn đặt lịch ngay hôm nay',
      'Gọi xác nhận lịch hẹn',
      'Khách hàng tiềm năng cao cho dịch vụ Facial',
      'new',
      'manual_test',
      2
    ];

    console.log('Adding dummy lead...');
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'CRM!A2',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [dummyLead] },
    });
    console.log('Dummy lead added successfully.');
  } catch (err) {
    console.error('FAILED:', err.message);
  }
}

addDummyLead();
