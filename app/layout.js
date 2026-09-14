import './globals.css';

export const metadata = {
  metadataBase: new URL('https://www.prontoaiapp.com.br'),
  title: {
    default: 'ProntoAí | Serviços, entregas, fretes e soluções para empresas',
    template: '%s | ProntoAí'
  },
  description: 'Serviços, entregas, fretes e OPS Operation em uma única plataforma. ProntoAí conecta pessoas, profissionais, entregadores, motoristas, comércios e empresas no Litoral Sul de São Paulo.',
  openGraph: {
    title: 'ProntoAí | Tudo o que você precisa, perto de você',
    description: 'Serviços, entregas, fretes e soluções para empresas em uma única plataforma.',
    type: 'website',
    locale: 'pt_BR'
  },
  robots: { index: false, follow: false }
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
