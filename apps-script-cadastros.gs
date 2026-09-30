const PRONTOAI_SHEET_ID = '1-JzdjpFmasmbKKP7nv_7LEIIK4nyclazjbJGOemRlh8';
const PRONTOAI_SHEET_NAME = 'Página1';
const PRONTOAI_DOCS_FOLDER = 'ProntoAi - Documentos Profissionais';
const PRONTOAI_FORM_VERSION = '2.0';

function doPost(e) {
  try {
    const p = e && e.parameter ? e.parameter : {};
    const action = String(p.acao || '').trim();

    if (action === 'salvarDocumentosProfissional') {
      return saveProfessionalDocuments_(p);
    }

    // Profissional, Comércio e Cliente usam a mesma entrada.
    return saveRegistration_(p);
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function saveRegistration_(p) {
  const sheet = getSheet_();
  ensureHeaders_(sheet);

  const type = normalizeType_(p.tipo);
  if (!type) throw new Error('Tipo de cadastro inválido.');

  const details = parseDetails_(p.opiniao || '');
  const bairro = String(p.bairro || details.Bairro || '').trim();
  const structured = buildStructuredData_(type, p, details);

  sheet.appendRow([
    new Date(),                     // A Data
    p.origem || '',                 // B avaliação/cadastro
    p.nome || '',                   // C nome
    p.whatsapp || '',               // D whatsapp
    p.email || '',                  // E email
    p.cidade || '',                 // F cidade
    type,                            // G categoria
    p.ocupacao || '',               // H ocupação
    p.avaliacao || '',              // I stars/avaliação legado
    p.indicaria || '',              // J descrição/indicação legado
    p.opiniao || '',                // K detalhes legados
    '', '', '', '', '',             // L:P documentos do profissional
    'Pendente',                     // Q status_cadastro
    bairro,                          // R bairro
    JSON.stringify(structured),      // S dados_formulario_json
    '',                              // T pasta_arquivos_url
    '',                              // U arquivos_enviados_em
    PRONTOAI_FORM_VERSION,           // V versao_formulario
    type.toLowerCase(),               // W perfil
    p.origem || '',                  // X origem_formulario
    '',                              // Y reservado
    ''                               // Z reservado
  ]);

  return json_({ ok: true, tipo: type });
}

function saveProfessionalDocuments_(p) {
  const sheet = getSheet_();
  ensureHeaders_(sheet);

  const whatsapp = digits_(p.whatsapp || '');
  if (!whatsapp) throw new Error('WhatsApp do profissional não informado.');
  if (!p.cpf) throw new Error('CPF não informado.');

  const row = findLatestLeadRowByPhoneAndType_(sheet, whatsapp, 'Profissional');
  if (!row) throw new Error('Cadastro do profissional não localizado na planilha.');

  const folder = getOrCreateFolder_(PRONTOAI_DOCS_FOLDER);
  const professionalName = safeName_(p.nome || sheet.getRange(row, 3).getDisplayValue() || 'profissional');
  const phoneKey = whatsapp.slice(-11);
  const subfolder = getOrCreateChildFolder_(folder, professionalName + ' - ' + phoneKey);

  const frontUrl = saveDataUrl_(subfolder, p.docFrente, 'documento-frente.jpg');
  const backUrl = saveDataUrl_(subfolder, p.docVerso, 'documento-verso.jpg');
  const selfieUrl = saveDataUrl_(subfolder, p.selfie, 'selfie.jpg');
  const now = new Date();

  sheet.getRange(row, 12, 1, 5).setValues([[
    p.cpf || '', frontUrl, backUrl, selfieUrl, now
  ]]);
  sheet.getRange(row, 20).setValue(subfolder.getUrl());
  sheet.getRange(row, 21).setValue(now);

  const currentJson = sheet.getRange(row, 19).getDisplayValue();
  let structured = {};
  try { structured = currentJson ? JSON.parse(currentJson) : {}; } catch (_) {}
  structured.verificacao = {
    cpf: p.cpf || '',
    documentoFrenteUrl: frontUrl,
    documentoVersoUrl: backUrl,
    selfieUrl: selfieUrl,
    pastaUrl: subfolder.getUrl(),
    enviadoEm: now.toISOString()
  };
  sheet.getRange(row, 19).setValue(JSON.stringify(structured));

  return json_({ ok: true, row: row, folderUrl: subfolder.getUrl() });
}

function buildStructuredData_(type, p, details) {
  const common = {
    tipo: type,
    nome: p.nome || '',
    whatsapp: p.whatsapp || '',
    email: p.email || '',
    cidade: p.cidade || '',
    bairro: p.bairro || details.Bairro || '',
    origemCadastro: p.origem || '',
    indicacao: p.indicaria || '',
    versaoFormulario: PRONTOAI_FORM_VERSION
  };

  if (type === 'Profissional') {
    return Object.assign(common, {
      profissao: details['Profissão'] || p.ocupacao || '',
      principalServico: details['Principal serviço'] || '',
      atendimento: details.Atendimento || '',
      regioesAtendidas: details['Regiões atendidas'] || '',
      autonomo: details['Autônomo'] || '',
      cnpj: details.CNPJ || '',
      instagram: details.Instagram || '',
      experiencia: details['Experiência'] || '',
      observacao: details['Observação'] || ''
    });
  }

  if (type === 'Comércio') {
    return Object.assign(common, {
      estabelecimento: details['Comércio'] || '',
      responsavel: details.Responsável || p.nome || '',
      segmento: details.Segmento || '',
      fazEntregasHoje: details['Faz entregas hoje'] || '',
      comoEntrega: details['Como entrega'] || '',
      volumeDia: details['Volume/dia'] || '',
      picoAumenta: details['Pico aumenta'] || '',
      volumePico: details['Volume no pico'] || '',
      variosEntregadores: details['Vários entregadores'] || '',
      interesseSobDemanda: details['Interesse Sob Demanda'] || '',
      interesseFuturo: details['Interesse futuro'] || '',
      instagram: details.Instagram || '',
      endereco: details['Endereço'] || '',
      observacao: details['Observação'] || ''
    });
  }

  return Object.assign(common, {
    interesses: details.Interesses || '',
    comoConheceu: details['Como conheceu'] || ''
  });
}

function parseDetails_(text) {
  const result = {};
  String(text || '').split(' | ').forEach(function(part) {
    const index = part.indexOf(':');
    if (index < 0) return;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (key) result[key] = value;
  });
  return result;
}

function normalizeType_(value) {
  const v = String(value || '').trim().toLowerCase();
  if (v === 'profissional') return 'Profissional';
  if (v === 'comércio' || v === 'comercio' || v === 'empresa') return 'Comércio';
  if (v === 'cliente') return 'Cliente';
  return '';
}

function getSheet_() {
  const sheet = SpreadsheetApp.openById(PRONTOAI_SHEET_ID).getSheetByName(PRONTOAI_SHEET_NAME);
  if (!sheet) throw new Error('Aba da planilha não encontrada.');
  return sheet;
}

function ensureHeaders_(sheet) {
  const headers = [
    'Data','avalacao/cadastro','nome','whatsaap','email','cidade','categoria','ocupação','stars','descrição','detalhes',
    'cpf','documento_frente_url','documento_verso_url','selfie_url','documentos_enviados_em',
    'status_cadastro','bairro','dados_formulario_json','pasta_arquivos_url','arquivos_enviados_em','versao_formulario','perfil','origem_formulario','reservado_1','reservado_2'
  ];
  const existing = sheet.getRange(1, 1, 1, headers.length).getDisplayValues()[0];
  headers.forEach(function(header, index) {
    if (!existing[index]) sheet.getRange(1, index + 1).setValue(header);
  });
}

function findLatestLeadRowByPhoneAndType_(sheet, normalizedPhone, type) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;
  const values = sheet.getRange(2, 4, lastRow - 1, 4).getDisplayValues();
  for (let i = values.length - 1; i >= 0; i--) {
    const phone = digits_(values[i][0]);
    const rowType = normalizeType_(values[i][3]);
    if (phone === normalizedPhone && rowType === type) return i + 2;
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
