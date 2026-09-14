'use client';

import { useState } from 'react';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxCRF7NdxVTNplnXwUjR-PUgTAd0xnh7J5Qj5cDFtVc5YDNQ0tgM6bmOpCPGWLubLC3/exec';

export default function LeadForm() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState('');
  const [tipo, setTipo] = useState('');
  const [cidade, setCidade] = useState('');
  const [cidadeOutro, setCidadeOutro] = useState('');
  const [ocupacao, setOcupacao] = useState('');
  const [ocupacaoOutro, setOcupacaoOutro] = useState('');
  const [segmento, setSegmento] = useState('');
  const [segmentoOutro, setSegmentoOutro] = useState('');
  const [colaboradores, setColaboradores] = useState('');
  const [veiculo, setVeiculo] = useState('');
  const [atuacao, setAtuacao] = useState('');

  function validateStep2() {
    if (!cidade) return 'Selecione sua cidade.';
    if (cidade === 'Outra cidade' && !cidadeOutro.trim()) return 'Digite sua cidade.';
    if (tipo === 'Profissional' && !ocupacao) return 'Selecione sua ocupação.';
    if (ocupacao === 'Outros' && !ocupacaoOutro.trim()) return 'Digite sua ocupação.';
    if ((tipo === 'Empresa' || tipo === 'Comércio') && !segmento) return 'Selecione o segmento.';
    if ((tipo === 'Empresa' || tipo === 'Comércio') && segmento === 'Outros' && !segmentoOutro.trim()) return 'Digite o segmento.';
    if (tipo === 'Empresa' && !colaboradores) return 'Selecione a quantidade de colaboradores.';
    if (tipo === 'Entregador / Motorista' && !veiculo) return 'Selecione como pretende trabalhar.';
    if (tipo === 'Entregador / Motorista' && !atuacao) return 'Selecione a modalidade.';
    return '';
  }

  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nome = String(form.get('nome') || '').trim();
    const whatsapp = String(form.get('whatsapp') || '').trim();
    const email = String(form.get('email') || '').trim();
    if (!nome || !whatsapp) return setStatus('Preencha nome e WhatsApp.');

    const cidadeFinal = cidade === 'Outra cidade' ? cidadeOutro.trim() : cidade;
    let ocupacaoFinal = '';
    let opiniao = '';
    if (tipo === 'Profissional') ocupacaoFinal = ocupacao === 'Outros' ? ocupacaoOutro.trim() : ocupacao;
    if (tipo === 'Empresa') {
      const seg = segmento === 'Outros' ? segmentoOutro.trim() : segmento;
      ocupacaoFinal = `OPS - Segmento: ${seg} | Colaboradores: ${colaboradores}`;
      opiniao = `Interesse no OPS Operation | Segmento: ${seg} | Colaboradores: ${colaboradores}`;
    }
    if (tipo === 'Comércio') {
      const seg = segmento === 'Outros' ? segmentoOutro.trim() : segmento;
      ocupacaoFinal = `Entregas - Segmento: ${seg}`;
      opiniao = `Interesse no modo Entregas | Segmento: ${seg}`;
    }
    if (tipo === 'Entregador / Motorista') {
      ocupacaoFinal = `Logística - Veículo: ${veiculo} | Atuação: ${atuacao}`;
      opiniao = `Interesse como Entregador / Motorista | Veículo: ${veiculo} | Modalidade: ${atuacao}`;
    }

    const dados = {
      origem: 'Cadastro Lista VIP - Etapa 2', nome, whatsapp, email,
      cidade: cidadeFinal, tipo, ocupacao: ocupacaoFinal,
      avaliacao: '', indicaria: '', opiniao
    };

    try {
      setStatus('Enviando...');
      await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(dados) });
      setStep(4);
      setStatus('');
    } catch {
      setStatus('Não foi possível enviar agora. Tente novamente.');
    }
  }

  return (
    <section id="cadastro" className="section signup">
      <div className="container signup-grid">
        <div><span className="eyebrow light">Lista VIP</span><h2>Entre antes no ProntoAí.</h2><p>Cadastre-se gratuitamente e faça parte do lançamento no Litoral Sul.</p></div>
        <form className="lead-form" onSubmit={submit}>
          <div className="progress"><span className={step >= 1 ? 'on' : ''}/><span className={step >= 2 ? 'on' : ''}/><span className={step >= 3 ? 'on' : ''}/></div>
          {step === 1 && <div className="form-step"><h3>Como você quer usar o ProntoAí?</h3><div className="type-grid">{['Cliente','Profissional','Entregador / Motorista','Comércio','Empresa'].map(v => <button type="button" key={v} className={tipo===v?'selected':''} onClick={()=>setTipo(v)}>{v}</button>)}</div><button className="btn primary full" type="button" onClick={()=> tipo ? (setStatus(''),setStep(2)) : setStatus('Escolha uma opção.')}>Continuar →</button></div>}
          {step === 2 && <div className="form-step"><h3>Conte um pouco mais.</h3><label>Cidade<select value={cidade} onChange={e=>setCidade(e.target.value)}><option value="">Selecione</option>{['Santos','São Vicente','Praia Grande','Guarujá','Cubatão','Peruíbe','Itanhaém','Mongaguá','Itariri','Outra cidade'].map(v=><option key={v}>{v}</option>)}</select></label>{cidade==='Outra cidade'&&<input placeholder="Digite sua cidade" value={cidadeOutro} onChange={e=>setCidadeOutro(e.target.value)}/>} {tipo==='Profissional'&&<><label>Ocupação<select value={ocupacao} onChange={e=>setOcupacao(e.target.value)}><option value="">Selecione</option>{['Eletricista','Encanador','Pedreiro','Pintor','Montador','Técnico','Outros'].map(v=><option key={v}>{v}</option>)}</select></label>{ocupacao==='Outros'&&<input placeholder="Sua ocupação" value={ocupacaoOutro} onChange={e=>setOcupacaoOutro(e.target.value)}/>}</>} {(tipo==='Empresa'||tipo==='Comércio')&&<><label>Segmento<select value={segmento} onChange={e=>setSegmento(e.target.value)}><option value="">Selecione</option>{['Alimentação','Varejo','Saúde','Beleza','Serviços','Construção','Outros'].map(v=><option key={v}>{v}</option>)}</select></label>{segmento==='Outros'&&<input placeholder="Digite o segmento" value={segmentoOutro} onChange={e=>setSegmentoOutro(e.target.value)}/>}</>} {tipo==='Empresa'&&<label>Colaboradores<select value={colaboradores} onChange={e=>setColaboradores(e.target.value)}><option value="">Selecione</option><option>1 a 5</option><option>6 a 20</option><option>21 a 50</option><option>51+</option></select></label>} {tipo==='Entregador / Motorista'&&<><label>Veículo<select value={veiculo} onChange={e=>setVeiculo(e.target.value)}><option value="">Selecione</option><option>Bicicleta</option><option>Moto</option><option>Carro</option><option>Utilitário / Van</option><option>Caminhão</option></select></label><label>Atuação<select value={atuacao} onChange={e=>setAtuacao(e.target.value)}><option value="">Selecione</option><option>Entregas</option><option>Fretes</option><option>Entregas e Fretes</option></select></label></>}<div className="actions"><button type="button" className="btn secondary" onClick={()=>setStep(1)}>Voltar</button><button type="button" className="btn primary" onClick={()=>{const e=validateStep2(); if(e)setStatus(e); else {setStatus('');setStep(3)}}}>Continuar →</button></div></div>}
          {step === 3 && <div className="form-step"><h3>Falta pouco.</h3><label>Nome completo<input name="nome" autoComplete="name"/></label><label>WhatsApp<input name="whatsapp" autoComplete="tel"/></label><label>E-mail<input name="email" type="email" autoComplete="email"/></label><div className="actions"><button type="button" className="btn secondary" onClick={()=>setStep(2)}>Voltar</button><button className="btn primary" type="submit">Entrar na Lista VIP</button></div></div>}
          {step === 4 && <div className="success"><div className="success-mark">✓</div><h3>Cadastro realizado!</h3><p>Você estará entre os primeiros a conhecer a nova experiência do ProntoAí.</p><button type="button" className="btn primary" onClick={()=>{setStep(1);setTipo('')}}>Novo cadastro</button></div>}
          {status && <p className="form-status">{status}</p>}
          <small>Seus dados serão usados somente para comunicação sobre o ProntoAí.</small>
        </form>
      </div>
    </section>
  );
}
