const SPREADSHEET_ID = '1VO8qU62UG1tQCokDQ2CtErQa2akHwKqZE44_Rjc6jm4';

function doPost(e) {
  const data = JSON.parse(e.postData.contents || '{}');
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheets()[0]; // перша вкладка таблиці (gid=0)
  const headers = ['Дата й час', 'Тип подарунка', 'Запланований подарунок', 'Побажання щодо сюрпризу', 'Стиль подарунка'];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    sheet.appendRow([
      new Date(),
      data.kind || '',
      data.plannedGift || '',
      data.surprisePreference || '',
      data.giftStyle || ''
    ]);
  } finally {
    lock.releaseLock();
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
