import Link from 'next/link';

export default function VerticalPage({ eyebrow, title, description, bullets }) {
  return <>
    <header className="site-header"><div className="container nav"><Link href="/" className="brand"><img src="/logo-prontoai.webp" alt="ProntoAí"/></Link><nav className="nav-links"><Link href="/">Início</Link><Link href="/entregas">Entregas</Link><Link href="/fretes">Fretes</Link><Link href="/ops">OPS Operation</Link></nav><Link className="btn primary" href="/#cadastro">Cadastre-se</Link></div></header>
    <main><section className="vertical-hero"><div className="container"><span className="eyebrow dark">{eyebrow}</span><h1>{title}</h1><p>{description}</p><Link className="btn primary" href="/#cadastro">Entrar na Lista VIP →</Link></div></section><section className="vertical-body"><div className="container vertical-grid">{bullets.map(([h,p])=><article key={h}><h3>{h}</h3><p>{p}</p></article>)}</div></section></main>
    <footer><div className="container footer"><div><img src="/logo-prontoai.webp" alt="ProntoAí"/><p>Conexão que resolve.</p></div><nav><Link href="/">Voltar ao início</Link><Link href="/#cadastro">Lista VIP</Link></nav></div></footer>
  </>;
}
