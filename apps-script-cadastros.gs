const PRONTOAI_SHEET_ID = '1-JzdjpFmasmbKKP7nv_7LEIIK4nyclazjbJGOemRlh8';
const PRONTOAI_SHEET_NAME = 'Página1';
const PRONTOAI_DOCS_FOLDER = 'ProntoAi - Documentos Profissionais';

function doPost(e) {
  try {
    const p = e && e.parameter ? e.parameter : {};
    const action = String(p.acao || '').trim();

    if (action === 'salvarDocumentosProfissional') {
      return saveProfessionalDocuments_(p);
    }

    return saveLead_(p);
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function saveLead_(p) {
  const sheet = SpreadsheetApp.openById(PRONTOAI_SHEET_ID).getSheetByName(PRONTOAI_SHEET_NAME);
  if (!sheet) throw new Error('Aba da planilha não encontrada.');

  ensureHeaders_(sheet);
  sheet.appendRow([
    new Date(),
    p.origem || '',
    p.nome || '',
    p.whatsapp || '',
    p.email || '',
    p.cidade || '',
    p.tipo || '',
    p.ocupacao || '',
    p.avaliacao || '',
    p.indicaria || '',
    p.opiniao || '',
    '', '', '', '', ''
  ]);

  return json_({ ok: true });
}

function saveProfessionalDocuments_(p) {
  const sheet = SpreadsheetApp.openById(PRONTOAI_SHEET_ID).getSheetByName(PRONTOAI_SHEET_NAME);
  if (!sheet) throw new Error('Aba da planilha não encontrada.');
  ensureHeaders_(sheet);

  const whatsapp = digits_(p.whatsapp || '');
  if (!whatsapp) throw new Error('WhatsApp do profissional não informado.');
  if (!p.cpf) throw new Error('CPF não informado.');

  const row = findLatestLeadRowByPhone_(sheet, whatsapp);
  if (!row) throw new Error('Cadastro do profissional não localizado na planilha.');

  const folder = getOrCreateFolder_(PRONTOAI_DOCS_FOLDER);
  const professionalName = safeName_(p.nome || sheet.getRange(row, 3).getDisplayValue() || 'profissional');
  const phoneKey = whatsapp.slice(-11);
  const subfolder = getOrCreateChildFolder_(folder, professionalName + ' - ' + phoneKey);

  const frontUrl = saveDataUrl_(subfolder, p.docFrente, 'documento-frente.jpg');
  const backUrl = saveDataUrl_(subfolder, p.docVerso, 'documento-verso.jpg');
  const selfieUrl = saveDataUrl_(subfolder, p.selfie, 'selfie.jpg');

  sheet.getRange(row, 12, 1, 5).setValues([[
    p.cpf || '',
    frontUrl,
    backUrl,
    selfieUrl,
    new Date()
  ]]);

  return json_({ ok: true, row: row, folderUrl: subfolder.getUrl() });
}

function ensureHeaders_(sheet) {
  const headers = [
    'Data','avalacao/cadastro','nome','whatsaap','email','cidade','categoria','ocupação','stars','descrição','detalhes',
    'cpf','documento_frente_url','documento_verso_url','selfie_url','documentos_enviados_em'
  ];
  const existing = sheet.getRange(1, 1, 1, headers.length).getDisplayValues()[0];
  headers.forEach(function(header, index) {
    if (!existing[index]) sheet.getRange(1, index + 1).setValue(header);
  });
}

function findLatestLeadRowByPhone_(sheet, normalizedPhone) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;
  const values = sheet.getRange(2, 4, lastRow - 1, 1).getDisplayValues();
  for (let i = values.length - 1; i >= 0; i--) {
    if (digits_(values[i][0]) === normalizedPhone) return i + 2;
  }
  return 0;
}

function getOrCreateFolder_(name) {
  const folders = DriveApp.getFoldersByName(name);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(name);
}

function getOrCreateChildFolder_(parent, name) {
  const folders = parent.getFoldersByName(name);
  return folders.hasNext() ? folders.next() : parent.createFolder(name);
}

function saveDataUrl_(folder, dataUrl, fileName) {
  if (!dataUrl) throw new Error('Imagem obrigatória ausente: ' + fileName);
  const match = String(dataUrl).match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error('Formato de imagem inválido.');
  const mime = match[1];
  const bytes = Utilities.base64Decode(match[2]);
  const blob = Utilities.newBlob(bytes, mime, fileName);
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);
  return file.getUrl();
}

function digits_(value) {
  return String(value || '').replace(/\D/g, '');
}

function safeName_(value) {
  return String(value || '').replace(/[\\/:*?"<>|#%{}~]/g, '-').replace(/\s+/g, ' ').trim().slice(0, 80) || 'profissional';
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
