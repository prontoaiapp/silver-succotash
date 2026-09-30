# ProntoAí — instalação do Apps Script unificado

Este branch usa **um único Apps Script** para os três formulários: Profissional, Comércio e Cliente.

## Arquivo a copiar

Copie todo o conteúdo de `apps-script-cadastros.gs` para o projeto Apps Script que hoje atende o endpoint usado pelos formulários.

## Publicação

1. Abra o Apps Script atual.
2. Substitua o código pelo conteúdo de `apps-script-cadastros.gs`.
3. Salve.
4. Em **Implantar > Gerenciar implantações**, edite a implantação Web App atual e publique uma **nova versão** para manter a mesma URL.
5. Execute uma vez pelo editor uma função que use Drive/Sheets, se o Google solicitar novas permissões, e autorize o acesso ao Google Sheets e Google Drive.

## O que o script faz

- Continua gravando todos os cadastros na planilha `Leads ProntoAí` / aba `Página1`.
- Reconhece automaticamente `Profissional`, `Comércio` e `Cliente`.
- Mantém as colunas legadas já existentes para não quebrar o ProntoAí Intelligence.
- Acrescenta status, bairro, versão e `dados_formulario_json` para leitura estruturada futura.
- Para Profissional, a ação `salvarDocumentosProfissional` salva CPF, documento frente, documento verso e selfie em pasta privada no Google Drive e grava os links na mesma linha do cadastro.
- Os arquivos do profissional são associados pelo WhatsApp + tipo de cadastro, usando o cadastro mais recente correspondente.

## Colunas adicionadas pelo script

A:Z ficam padronizadas com:

- A Data
- B avalacao/cadastro
- C nome
- D whatsaap
- E email
- F cidade
- G categoria
- H ocupação
- I stars
- J descrição
- K detalhes
- L cpf
- M documento_frente_url
- N documento_verso_url
- O selfie_url
- P documentos_enviados_em
- Q status_cadastro
- R bairro
- S dados_formulario_json
- T pasta_arquivos_url
- U arquivos_enviados_em
- V versao_formulario
- W perfil
- X origem_formulario
- Y reservado_1
- Z reservado_2

## Teste depois da publicação

Faça nesta ordem:

1. Cadastro Profissional.
2. Etapa de documentos do Profissional.
3. Cadastro Comércio com `Sim` em entregas.
4. Cadastro Comércio com `Não` em entregas para confirmar que os campos condicionais continuam limpos.
5. Cadastro Cliente com pelo menos um interesse.
6. Confira as cinco linhas/atualizações na planilha e confirme a coluna S (`dados_formulario_json`).
7. Confirme no Drive a pasta `ProntoAi - Documentos Profissionais` e os três arquivos do profissional.

Não altere a URL `SCRIPT_URL` nos formulários se a implantação existente for apenas atualizada para uma nova versão.