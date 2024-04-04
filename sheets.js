const {google} = require('googleapis');

function sheetsCreator (data){
const serviceAccountKeyFile = "./sheets_handler.json";
const sheetId = '1fwyCibhluvwFi8Hck_lei-cW0JEajS4FAi9RpWnXSIk'
const tabName = 'scorer'
const range = 'A:E'

main().then(() => {
  console.log('Completed')
})

async function main() {
  // Generating google sheet client
  const googleSheetClient = await _getGoogleSheetClient();
  await _writeGoogleSheet(googleSheetClient, sheetId, tabName, range, [data]);
}

async function _getGoogleSheetClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: serviceAccountKeyFile,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const authClient = await auth.getClient();
  return google.sheets({
    version: 'v4',
    auth: authClient,
  });
}


async function _writeGoogleSheet(googleSheetClient, sheetId, tabName, range, data) {
  await googleSheetClient.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${tabName}!${range}`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    resource: {
      "majorDimension": "ROWS",
      "values": data
    },
  })
}
}

function sheetsExpenses (data){
  const serviceAccountKeyFile = "./sheets_handler.json";
  const sheetId = '1fwyCibhluvwFi8Hck_lei-cW0JEajS4FAi9RpWnXSIk'
  const tabName = 'expenses'
  const range = 'A:C'
  
  main().then(() => {
    console.log('Completed')
  })
  
  async function main() {
    // Generating google sheet client
    const googleSheetClient = await _getGoogleSheetClient();
    await _writeGoogleSheet(googleSheetClient, sheetId, tabName, range, [data]);
  }
  
  async function _getGoogleSheetClient() {
    const auth = new google.auth.GoogleAuth({
      keyFile: serviceAccountKeyFile,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const authClient = await auth.getClient();
    return google.sheets({
      version: 'v4',
      auth: authClient,
    });
  }
  
  
  async function _writeGoogleSheet(googleSheetClient, sheetId, tabName, range, data) {
    await googleSheetClient.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${tabName}!${range}`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        "majorDimension": "ROWS",
        "values": data
      },
    })
  }
  }

module.exports= {sheetsCreator, sheetsExpenses}