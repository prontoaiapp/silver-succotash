import Link from 'next/link';
import LeadForm from '../components/LeadForm';

const solutions = [
  ['Serviços','Encontre profissionais próximos, compare avaliações e acompanhe cada etapa do atendimento.','/servicos-card.webp','#cadastro'],
  ['Entregas','Solicite entregas únicas ou sob demanda para pessoas, pequenos negócios e comércios.','/entregas-card.webp','/entregas'],
  ['Fretes','Encontre veículos e profissionais para pequenos fretes, mudanças e operações locais.','/fretes-card.webp','/fretes'],
  ['OPS Operation','Gestão de equipes, chamados, prestadores, entregas, agenda e operação em tempo real para empresas.','/ops-card.webp','/ops']
];

const cities = [
  ['Santos','/cidade-santos.webp'],['São Vicente','/cidade-sao-vicente.webp'],['Praia Grande','/cidade-praia-grande.webp'],['Guarujá','/cidade-guaruja.webp'],['Cubatão','/cidade-cubatao.webp'],['Peruíbe','/cidade-peruibe.webp'],['Itanhaém','/cidade-itanhaem.webp'],['Mongaguá','/cidade-mongagua.webp'],['Itariri','/cidade-itariri.webp']
];

export default function Home() {
  return <>
    <header className="site-header"><div className="container nav"><a href="#inicio" className="brand"><img src="/logo-prontoai.webp" alt="ProntoAí"/></a><nav className="nav-links"><a href="#solucoes">Soluções</a><Link href="/entregas">Entregas</Link><Link href="/fretes">Fretes</Link><a href="#como-funciona">Como funciona</a><a href="#cidades">Cidades</a><Link href="/ops">OPS Operation</Link></nav><a className="btn primary" href="#cadastro">Cadastre-se gratuitamente</a></div></header>

    <main>
      <section className="hero" id="inicio"><picture className="hero-bg"><source media="(max-width:760px)" srcSet="/hero-mobile.webp"/><img src="/hero-desktop.webp" alt=""/></picture><div className="hero-overlay"/><div className="container hero-content"><span className="eyebrow dark">Lançamento no Litoral Sul de São Paulo</span><h1>Tudo o que você precisa, <em>perto de você.</em></h1><p>Serviços, entregas, fretes e OPS Operation em uma única plataforma. Encontre, escolha, acompanhe e resolva com mais praticidade e segurança.</p><div className="hero-actions"><a className="btn primary" href="#cadastro">Quero acesso antecipado →</a><a className="btn ghost" href="#cadastro">Sou profissional</a></div><div className="stats"><div><strong>300+</strong><span>Profissionais pré-cadastrados</span></div><div><strong>250+</strong><span>Categorias de serviço</span></div><div><strong>9</strong><span>Cidades no lançamento</span></div></div></div></section>

      <section className="section light" id="solucoes"><div className="container"><div className="section-head"><span className="eyebrow light">Nossas soluções</span><h2>Um ecossistema completo para facilitar sua vida.</h2><p>Quatro frentes conectadas para pessoas, profissionais, entregadores e empresas.</p></div><div className="solution-grid">{solutions.map(([title,text,img,href],i)=><article className="card" key={title}><img src={img} alt=""/><div className="card-body"><span className="index">0{i+1}</span><h3>{title}</h3><p>{text}</p>{href.startsWith('/')?<Link href={href}>Saiba mais →</Link>:<a href={href}>Saiba mais →</a>}</div></article>)}</div></div></section>

      <section className="section dark-section" id="como-funciona"><div className="container"><div className="section-head narrow"><span className="eyebrow dark">Como funciona</span><h2>Simples, rápido e seguro do início ao fim.</h2></div><div className="steps">{[['01','Escolha o que precisa'],['02','Veja opções próximas'],['03','Confirme com segurança'],['04','Acompanhe e avalie']].map(([n,t])=><div key={n}><span>{n}</span><h3>{t}</h3></div>)}</div></div></section>

      <section className="section"><div className="container app-block"><div><span className="eyebrow light">Dentro do aplicativo</span><h2>Tudo o que você precisa em poucos toques.</h2><p>Uma experiência simples e intuitiva para resolver sua rotina com agilidade.</p></div><div className="phones">{['app-tela-inicial.webp','app-home-servicos.webp','app-buscando-profissional.webp','app-profissional-encontrado.webp'].map((v,i)=><img key={v} src={'/'+v} alt={'Tela do aplicativo ProntoAí '+(i+1)}/>)}</div></div></section>

      <section className="section light"><div className="container professional"><img src="/profissional-founder.webp" alt="Profissional fundador do ProntoAí"/><div><span className="eyebrow light">Profissionais fundadores</span><h2>Mais oportunidades para quem sabe trabalhar.</h2><p>Cadastre-se gratuitamente e faça parte do grupo inicial de profissionais do ProntoAí na sua região.</p><a className="btn primary" href="#cadastro">Quero ser profissional fundador →</a></div></div></section>

      <section className="section" id="cidades"><div className="container"><div className="section-head"><span className="eyebrow light">Região de lançamento</span><h2>Começamos pelo Litoral Sul.</h2><p>As primeiras cidades do ProntoAí, conectadas em uma única região.</p></div><div className="city-grid">{cities.map(([name,img])=><article key={name}><img src={img} alt={name}/><div><h3>{name}</h3><span>Litoral Sul de São Paulo</span></div></article>)}</div></div></section>

      <LeadForm/>
    </main>

    <footer><div className="container footer"><div><img src="/logo-prontoai.webp" alt="ProntoAí"/><p>Serviços, entregas, fretes e OPS Operation em uma única plataforma.</p></div><nav><a href="#solucoes">Soluções</a><Link href="/entregas">Entregas</Link><Link href="/fretes">Fretes</Link><Link href="/ops">OPS Operation</Link><a href="#cadastro">Lista VIP</a></nav></div><div className="container copyright">© 2026 ProntoAí · Conexão que resolve · Todos os direitos reservados</div></footer>
  </>;
}
