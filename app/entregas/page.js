import VerticalPage from '../../components/VerticalPage';

export const metadata = { title: 'Entregas', description: 'Entregas locais para pessoas e comércios com acompanhamento pelo ProntoAí.' };

export default function Page(){return <VerticalPage eyebrow="ProntoAí Entregas" title="Entregas sob demanda, do seu jeito." description="Conecte pessoas e comércios a entregadores da região para coletas e entregas com mais previsibilidade, acompanhamento e praticidade." bullets={[["Para pessoas","Solicite uma entrega pontual com retirada e destino definidos."],["Para comércios","Organize entregas sob demanda sem depender de estrutura própria."],["Acompanhamento","Veja o andamento da solicitação e acompanhe cada etapa da entrega."]]}/>}
