/**
 * Ferrey — Recebedor de cadastros do Acesso Antecipado (Android)
 * Cola este código em: Planilha Google > Extensões > Apps Script
 * Depois faça o Deploy como "App da Web" (instruções no arquivo LEIA-ME).
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000); // evita colisão quando muita gente envia ao mesmo tempo
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Cadastros') || ss.getSheets()[0];

    // Cria o cabeçalho automaticamente na primeira vez
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Data', 'Instagram', 'Modelo do celular', 'Email', 'Aceitou feedback']);
    }

    var p = e.parameter;
    sheet.appendRow([
      new Date(),
      p.instagram || '',
      p.modelo_do_celular || '',
      p.email || '',
      p.aceita_feedback ? 'Sim' : ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, erro: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
