import { sponsorOffers, type SponsorPlanId } from '../config';

export interface SponsorPlan {
  id: SponsorPlanId;
  formato: string;
  preco: string;
  rotulo?: string;
}

export const sponsorPlans: SponsorPlan[] = [
  {
    id: 'destaque',
    formato: 'Listagem destacada na categoria (30 dias)',
    preco: sponsorOffers.destaque.preco,
    rotulo: sponsorOffers.destaque.rotulo,
  },
  {
    id: 'newsletter',
    formato: 'Patrocínio de 1 edição da newsletter',
    preco: sponsorOffers.newsletter.preco,
    rotulo: sponsorOffers.newsletter.rotulo,
  },
  {
    id: 'categoria',
    formato: 'Patrocinador da categoria (1 por categoria, mensal)',
    preco: sponsorOffers.categoria.preco,
    rotulo: sponsorOffers.categoria.rotulo,
  },
  {
    id: 'fundador',
    formato: 'Pacote fundador (listagem + 4 edições)',
    preco: sponsorOffers.fundador.preco,
    rotulo: sponsorOffers.fundador.rotulo,
  },
];

export const pitchSubject =
  'Fale direto com contadores e donos de PME que estão adotando IA';

export const pitchBody =
  'Olá, [nome]! Eu sou o Lucas, criador do Guia IA Brasil, diretório e newsletter semanal de ferramentas de IA para contadores e PMEs brasileiras. 78% dos contadores já usam IA toda semana e 68% não têm capacitação (IOB/CFC/Fenacon, 2026). Nosso leitor está escolhendo ferramentas agora. Tenho vagas de patrocínio para [mês]: destaque no topo da categoria [Fiscal/ERP] + menção na newsletter. Topa uma conversa de 15 min? Mando o mídia kit com os números atuais.';
