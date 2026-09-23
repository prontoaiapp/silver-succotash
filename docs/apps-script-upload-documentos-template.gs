// ProntoAí — TEMPLATE de upload de documentos
// NÃO publicar isoladamente antes de integrar ao doPost/doGet atual.
// Amanhã substituir FOLDER_ID pela pasta privada do Google Drive e mesclar com o Apps Script existente.

const DOCUMENTOS_FOLDER_ID = 'SUBSTITUIR_PELO_ID_DA_PASTA_PRIVADA';

function salvarImagemBase64_(dataUrl, nomeArquivo) {
  if (!dataUrl || typeof dataUrl !== 'string') throw new Error('Imagem ausente');

  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) throw new Error('Formato de imagem inválido');

  const mimeType = match[1];
  const bytes = Utilities.base64Decode(match[2]);
  const blob = Utilities.newBlob(bytes, mimeType, nomeArquivo);

  const pasta = DriveApp.getFolderById(DOCUMENTOS_FOLDER_ID);
  const arquivo = pasta.createFile(blob);

  // Mantém privado. NÃO usar setSharing(ANYONE_WITH_LINK, ...).
  return {
    id: arquivo.getId(),
    nome: arquivo.getName()
  };
}

function sanitizarNomeArquivo_(valor) {
  return String(valor || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'cadastro';
}

function salvarDocumentosCadastro_(payload) {
  const nomeBase = sanitizarNomeArquivo_(payload.nome);
  const timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'America/Sao_Paulo', 'yyyyMMdd-HHmmss');
  const prefixo = nomeBase + '-' + timestamp;

  const frente = salvarImagemBase64_(payload.documento_frente, prefixo + '-documento-frente.jpg');
  const verso = salvarImagemBase64_(payload.documento_verso, prefixo + '-documento-verso.jpg');
  const selfie = salvarImagemBase64_(payload.selfie, prefixo + '-selfie.jpg');

  return {
    documento_frente_id: frente.id,
    documento_verso_id: verso.id,
    selfie_id: selfie.id
  };
}

// Exemplo de bloco para MESCLAR dentro do doPost(e) atual:
//
// const payload = JSON.parse(e.postData.contents || '{}');
// if (payload.acao === 'salvar_documentos') {
//   // Validar token/identidade conforme a segurança do projeto atual.
//   // Validar CPF, nome e consentimento.
//   const docs = salvarDocumentosCadastro_(payload);
//
//   // Aqui podemos:
//   // 1) localizar o cadastro existente pelo WhatsApp/ID;
//   // 2) gravar APENAS os IDs dos arquivos na planilha ou em uma aba separada;
//   // 3) retornar JSON com sucesso.
//
//   return ContentService
//     .createTextOutput(JSON.stringify({ success: true, documentos: docs }))
//     .setMimeType(ContentService.MimeType.JSON);
// }

function validarCpfBasico_(cpf) {
  cpf = String(cpf || '').replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += Number(cpf[i]) * (10 - i);
  let d1 = (soma * 10) % 11;
  if (d1 === 10) d1 = 0;
  if (d1 !== Number(cpf[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += Number(cpf[i]) * (11 - i);
  let d2 = (soma * 10) % 11;
  if (d2 === 10) d2 = 0;
  return d2 === Number(cpf[10]);
}

// Estrutura de payload planejada para o front-end:
// {
//   acao: 'salvar_documentos',
//   tipo: 'Profissional',
//   nome: 'Nome Completo',
//   cpf: '00000000000',
//   whatsapp: '13999999999',
//   consentimento_documentos: true,
//   documento_frente: 'data:image/jpeg;base64,...',
//   documento_verso: 'data:image/jpeg;base64,...',
//   selfie: 'data:image/jpeg;base64,...'
// }
