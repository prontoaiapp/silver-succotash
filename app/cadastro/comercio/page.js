'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

const SCRIPT_URL='https://script.google.com/macros/s/AKfycbxCRF7NdxVTNplnXwUjR-PUgTAd0xnh7J5Qj5cDFtVc5YDNQ0tgM6bmOpCPGWLubLC3/exec';
const cidades=['Santos','São Vicente','Praia Grande','Guarujá','Cubatão','Peruíbe','Itanhaém','Mongaguá','Itariri','Outra cidade'];
const segmentos=['Restaurante','Lanchonete','Mercado','Farmácia','Loja','Pet shop','Autopeças','Material de construção','Beleza','Outro'];

const Field=({label,children})=><div className="field"><label>{label}</label>{children}</div>;

export default function CadastroComercio(){
  const [form,setForm]=useState({nomeEstabelecimento:'',responsavel:'',whatsapp:'',email:'',cidade:'',cidadeOutro:'',bairro:'',segmento:'',segmentoOutro:'',fazEntregas:'',comoEntrega:[],volumeDia:'',picoAumenta:'',volumePico:'',variosEntregadores:'',sobDemanda:'',interesseFuturo:'',instagram:'',endereco:'',observacao:'',origem:'WhatsApp / Prospecção',indicacao:'',aceite:false,marketing:false});
  const [status,setStatus]=useState('idle');
  const [erro,setErro]=useState('');
  const fazEntregas=form.fazEntregas==='sim'||form.fazEntregas==='as_vezes';
  const cidadeFinal=form.cidade==='Outra cidade'?form.cidadeOutro:form.cidade;
  const segmentoFinal=form.segmento==='Outro'?form.segmentoOutro:form.segmento;

  function set(name,value){setForm(v=>({...v,[name]:value}));}
  function maskPhone(value){const d=value.replace(/\D/g,'').slice(0,11);if(d.length>10)return d.replace(/^(\d{2})(\d{5})(\d{4})$/,'($1) $2-$3');if(d.length>6)return d.replace(/^(\d{2})(\d{4})(\d{0,4})$/,'($1) $2-$3');if(d.length>2)return d.replace(/^(\d{2})(\d+)/,'($1) $2');return d;}
  function toggleEntrega(item){setForm(v=>({...v,comoEntrega:v.comoEntrega.includes(item)?v.comoEntrega.filter(x=>x!==item):[...v.comoEntrega,item]}));}
  function onFazEntregas(value){setForm(v=>({...v,fazEntregas:value,...(value==='nao'?{comoEntrega:[],volumeDia:'',picoAumenta:'',volumePico:'',variosEntregadores:'',sobDemanda:''}:{interesseFuturo:''})}));}

  const opiniao=useMemo(()=>{
    const partes=[
      `Comércio: ${form.nomeEstabelecimento||'-'}`,
      `Responsável: ${form.responsavel||'-'}`,
      `Bairro: ${form.bairro||'-'}`,
      `Segmento: ${segmentoFinal||'-'}`,
      `Faz entregas hoje: ${form.fazEntregas||'-'}`,
      fazEntregas?`Como entrega: ${form.comoEntrega.join(', ')||'-'}`:null,
      fazEntregas?`Volume/dia: ${form.volumeDia||'-'}`:null,
      fazEntregas?`Pico aumenta: ${form.picoAumenta||'-'}`:null,
      fazEntregas&&form.picoAumenta==='sim'?`Volume no pico: ${form.volumePico||'-'}`:null,
      fazEntregas?`Vários entregadores simultâneos: ${form.variosEntregadores||'-'}`:null,
      fazEntregas?`Interesse Sob Demanda: ${form.sobDemanda||'-'}`:`Interesse futuro em entregas: ${form.interesseFuturo||'-'}`,
      `Instagram: ${form.instagram||'-'}`,
      `Endereço: ${form.endereco||'-'}`,
      `Indicação: ${form.indicacao||'-'}`,
      `Observação: ${form.observacao||'-'}`,
      `Aceita novidades: ${form.marketing?'sim':'não'}`
    ];
    return partes.filter(Boolean).join(' | ');
  },[form,fazEntregas,segmentoFinal]);

  async function submit(e){
    e.preventDefault();setErro('');
    if(!form.nomeEstabelecimento||!form.responsavel||!form.whatsapp||!cidadeFinal||!form.bairro||!segmentoFinal||!form.fazEntregas){setErro('Preencha os campos obrigatórios.');return;}
    if(fazEntregas&&(!form.comoEntrega.length||!form.volumeDia||!form.variosEntregadores||!form.sobDemanda)){setErro('Complete as informações sobre suas entregas.');return;}
    if(!fazEntregas&&!form.interesseFuturo){setErro('Informe se teria interesse em usar entregas futuramente.');return;}
    if(!form.aceite){setErro('É necessário aceitar os Termos de Uso e a Política de Privacidade.');return;}
    setStatus('sending');
    const dados={origem:form.origem,nome:form.responsavel,whatsapp:form.whatsapp,email:form.email,cidade:cidadeFinal,tipo:'Comércio',ocupacao:`Entregas - Segmento: ${segmentoFinal}`,avaliacao:'',indicaria:form.indicacao,opiniao};
    try{await fetch(SCRIPT_URL,{method:'POST',mode:'no-cors',body:new URLSearchParams(dados)});setStatus('success');window.scrollTo({top:0,behavior:'smooth'});}catch{setStatus('idle');setErro('Não foi possível enviar agora. Tente novamente.');}
  }

  if(status==='success')return <main className="page"><div className="shell success"><img src="/logo-prontoai.webp" alt="ProntoAí"/><div className="check">✓</div><h1>Cadastro realizado!</h1><p>Seja bem-vindo ao ProntoAí. Seu comércio agora faz parte da nossa rede.</p><Link href="/" className="primary">Conhecer o ProntoAí</Link></div><Styles/></main>;

  return <main className="page"><div className="shell">
    <header className="top"><Link href="/"><img src="/logo-prontoai.webp" alt="ProntoAí"/></Link><span>Cadastro gratuito</span></header>
    <section className="hero"><span className="eyebrow">Comércios • Litoral Sul</span><h1>Cadastre seu comércio no <em>ProntoAí.</em></h1><p>Preencha em poucos minutos. As perguntas se adaptam ao perfil do seu negócio.</p></section>
    <form onSubmit={submit} className="card">
      <h2>1. Dados do comércio</h2>
      <div className="grid"><Field label="Nome do estabelecimento *"><input value={form.nomeEstabelecimento} onChange={e=>set('nomeEstabelecimento',e.target.value)} placeholder="Ex.: Padaria Central"/></Field><Field label="Nome do responsável *"><input value={form.responsavel} onChange={e=>set('responsavel',e.target.value)} placeholder="Nome completo"/></Field><Field label="WhatsApp *"><input value={form.whatsapp} onChange={e=>set('whatsapp',maskPhone(e.target.value))} inputMode="tel" placeholder="(13) 99999-9999"/></Field><Field label="E-mail"><input value={form.email} onChange={e=>set('email',e.target.value)} type="email" placeholder="voce@empresa.com.br"/></Field><Field label="Cidade *"><select value={form.cidade} onChange={e=>set('cidade',e.target.value)}><option value="">Selecione</option>{cidades.map(x=><option key={x}>{x}</option>)}</select></Field>{form.cidade==='Outra cidade'&&<Field label="Digite sua cidade *"><input value={form.cidadeOutro} onChange={e=>set('cidadeOutro',e.target.value)}/></Field>}<Field label="Bairro *"><input value={form.bairro} onChange={e=>set('bairro',e.target.value)} placeholder="Seu bairro"/></Field><Field label="Segmento *"><select value={form.segmento} onChange={e=>set('segmento',e.target.value)}><option value="">Selecione</option>{segmentos.map(x=><option key={x}>{x}</option>)}</select></Field>{form.segmento==='Outro'&&<Field label="Digite o segmento *"><input value={form.segmentoOutro} onChange={e=>set('segmentoOutro',e.target.value)}/></Field>}</div>

      <h2>2. Entregas</h2><Field label="Seu comércio faz entregas hoje? *"><div className="choices">{[['sim','Sim'],['as_vezes','Às vezes'],['nao','Não']].map(([v,l])=><button type="button" key={v} className={form.fazEntregas===v?'active':''} onClick={()=>onFazEntregas(v)}>{l}</button>)}</div></Field>
      {fazEntregas&&<div className="conditional"><Field label="Como você faz suas entregas hoje? *"><div className="checks">{['Entregador próprio','Motoboy avulso','Plataforma de entrega','Retirada pelo cliente','Outro'].map(x=><label key={x}><input type="checkbox" checked={form.comoEntrega.includes(x)} onChange={()=>toggleEntrega(x)}/>{x}</label>)}</div></Field><div className="grid"><Field label="Quantas entregas costuma fazer por dia? *"><select value={form.volumeDia} onChange={e=>set('volumeDia',e.target.value)}><option value="">Selecione</option>{['1 a 5','6 a 10','11 a 20','21 a 50','Mais de 50'].map(x=><option key={x}>{x}</option>)}</select></Field><Field label="Nos dias de pico esse volume aumenta?"><select value={form.picoAumenta} onChange={e=>set('picoAumenta',e.target.value)}><option value="">Selecione</option><option value="sim">Sim</option><option value="nao">Não</option></select></Field>{form.picoAumenta==='sim'&&<Field label="Em um dia de pico, aproximadamente quantas entregas?"><select value={form.volumePico} onChange={e=>set('volumePico',e.target.value)}><option value="">Selecione</option>{['Até 10','11 a 20','21 a 50','Mais de 50'].map(x=><option key={x}>{x}</option>)}</select></Field>}<Field label="Precisa de vários entregadores ao mesmo tempo? *"><select value={form.variosEntregadores} onChange={e=>set('variosEntregadores',e.target.value)}><option value="">Selecione</option><option value="sim">Sim</option><option value="nao">Não</option></select></Field><Field label="Interesse em Entrega Sob Demanda? *"><select value={form.sobDemanda} onChange={e=>set('sobDemanda',e.target.value)}><option value="">Selecione</option><option>Sim</option><option>Talvez</option><option>Não agora</option></select></Field></div></div>}
      {form.fazEntregas==='nao'&&<div className="conditional"><Field label="Se surgir necessidade, teria interesse em solicitar entregas pelo ProntoAí? *"><div className="choices">{['Sim','Talvez','Não agora'].map(x=><button type="button" key={x} className={form.interesseFuturo===x?'active':''} onClick={()=>set('interesseFuturo',x)}>{x}</button>)}</div></Field></div>}

      <h2>3. Informações complementares</h2><div className="grid"><Field label="Instagram"><input value={form.instagram} onChange={e=>set('instagram',e.target.value)} placeholder="@seucomercio"/></Field><Field label="Endereço"><input value={form.endereco} onChange={e=>set('endereco',e.target.value)} placeholder="Opcional nesta etapa"/></Field><Field label="Quem indicou você?"><input value={form.indicacao} onChange={e=>set('indicacao',e.target.value)} placeholder="Nome, comércio ou profissional"/></Field></div><Field label="Observação"><textarea value={form.observacao} onChange={e=>set('observacao',e.target.value)} placeholder="Algo que gostaria de nos contar?"/></Field>
      <label className="consent"><input type="checkbox" checked={form.aceite} onChange={e=>set('aceite',e.target.checked)}/>Li e concordo com os Termos de Uso e Política de Privacidade do ProntoAí. *</label><label className="consent"><input type="checkbox" checked={form.marketing} onChange={e=>set('marketing',e.target.checked)}/>Aceito receber informações e novidades do ProntoAí pelo WhatsApp.</label>
      {erro&&<div className="error">{erro}</div>}<button className="submit" disabled={status==='sending'}>{status==='sending'?'Cadastrando...':'Concluir cadastro gratuito'}</button><p className="privacy">Seus dados serão usados somente para cadastro e comunicação do ProntoAí.</p>
    </form>
  </div><Styles/></main>;
}

function Styles(){return <style jsx global>{`
  .page{min-height:100vh;background:linear-gradient(145deg,#06192d 0,#0a355d 36%,#f7f9fc 36%,#f7f9fc 100%);padding:28px 0 70px;color:#0b1728;font-family:Inter,Arial,sans-serif}.shell{width:min(980px,calc(100% - 28px));margin:auto}.top{display:flex;align-items:center;justify-content:space-between;color:white;margin-bottom:44px}.top img,.success img{height:64px}.top span{font-weight:800;color:#dfff78}.hero{color:white;max-width:720px;margin-bottom:34px}.eyebrow{display:inline-block;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.07);padding:8px 12px;border-radius:999px;font-size:.72rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em}.hero h1{font-family:Manrope,Inter,sans-serif;font-size:clamp(2.3rem,6vw,4.4rem);line-height:.98;letter-spacing:-.05em;margin:18px 0 14px}.hero h1 em{font-style:normal;color:#a6e100}.hero p{color:rgba(255,255,255,.74);line-height:1.65}.card{background:white;border-radius:30px;padding:34px;box-shadow:0 28px 70px rgba(6,25,45,.15)}.card h2{font-family:Manrope,sans-serif;font-size:1.3rem;margin:8px 0 18px}.card h2:not(:first-child){margin-top:34px;padding-top:28px;border-top:1px solid #e5edf4}.grid{display:grid;grid-template-columns:1fr 1fr;gap:15px}.field{margin-bottom:15px}.field>label{display:block;font-size:.78rem;font-weight:800;color:#475569;margin-bottom:7px}.field input,.field select,.field textarea{width:100%;border:1px solid #dce6ef;background:#fbfdff;border-radius:14px;padding:14px 15px;outline:none}.field textarea{min-height:100px;resize:vertical}.field input:focus,.field select:focus,.field textarea:focus{border-color:#1b6bb5;box-shadow:0 0 0 4px rgba(27,107,181,.09)}.choices{display:flex;gap:10px;flex-wrap:wrap}.choices button{border:1px solid #dce6ef;background:#fbfdff;padding:13px 20px;border-radius:14px;font-weight:800}.choices button.active{background:#eef9d5;border-color:#a6e100;color:#315300}.checks{display:grid;grid-template-columns:1fr 1fr;gap:10px}.checks label,.consent{display:flex;gap:9px;align-items:flex-start;font-size:.86rem;line-height:1.45}.conditional{background:#f6fbff;border:1px solid #dbeaf7;padding:18px;border-radius:20px;margin-top:8px}.consent{margin-top:13px}.consent input,.checks input{margin-top:3px;accent-color:#1b6bb5}.submit,.primary{width:100%;border:0;border-radius:999px;background:#a6e100;color:#173000;padding:16px 22px;font-weight:900;font-size:1rem;margin-top:22px;display:inline-flex;justify-content:center;text-decoration:none}.submit:disabled{opacity:.65}.error{margin-top:16px;padding:12px 14px;border-radius:12px;background:#fff1f0;color:#b42318;font-weight:700}.privacy{text-align:center;color:#647084;font-size:.75rem;margin-top:12px}.success{margin-top:10vh;background:white;border-radius:30px;padding:44px;text-align:center;box-shadow:0 28px 70px rgba(6,25,45,.18)}.success img{margin:0 auto 26px}.check{width:78px;height:78px;border-radius:24px;background:#eef9d5;color:#5e8200;display:grid;place-items:center;font-size:2rem;font-weight:900;margin:0 auto 18px}.success h1{font-size:2.2rem}.success p{color:#647084;line-height:1.6;margin:10px auto 18px;max-width:540px}@media(max-width:700px){.page{background:linear-gradient(145deg,#06192d 0,#0a355d 24%,#f7f9fc 24%,#f7f9fc 100%)}.top{margin-bottom:32px}.top img{height:54px}.top span{font-size:.8rem}.hero{padding-bottom:4px}.card{padding:22px;border-radius:24px}.grid,.checks{grid-template-columns:1fr}.choices button{flex:1}.success{padding:28px}}
`}</style>}
