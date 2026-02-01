// google-apps-script.js
// Deploy as Web App. Saves form fields into a sheet.
//
// Recommended:
// - Create a sheet tab named "Leads" (or the script will create it)
// - Deploy: Execute as "Me", Access: "Anyone"

function doGet() {
  // Quick health check (open the /exec URL in a browser)
  return ContentService.createTextOutput('ok');
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Leads') || ss.insertSheet('Leads');

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['timestamp','name','email','phone','city','project','message']);
  }

  var p = (e && e.parameter) ? e.parameter : {};
  sheet.appendRow([
    new Date().toISOString(),
    p.name || '',
    p.email || '',
    p.phone || '',
    p.city || '',
    p.project || '',
    p.message || ''
  ]);

  return ContentService.createTextOutput('ok');
}
