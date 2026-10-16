import type { SponsorPlanId } from '../config';

export interface SponsorPlan {
  id: SponsorPlanId;
  formato: string;
  preco: string;
}

export const sponsorPlans: SponsorPlan[] = [
  { id: 'destaque', formato: 'Listagem destacada na categoria (30 dias)', preco: 'R$ 290' },
  { id: 'newsletter', formato: 'Patrocínio de 1 edição da newsletter', preco: 'R$ 490' },
  { id: 'categoria', formato: 'Patrocinador da categoria (1 por categoria, mensal)', preco: 'R$ 990/mês' },
  { id: 'fundador', formato: 'Pacote fundador (listagem + 4 edições)', preco: 'R$ 1.490' },
];

export const pitchSubject =
  'Fale direto com contadores e donos de PME que estão adotando IA';

export const pitchBody =
  'Olá, [nome]! Eu sou o Lucas, criador do Guia IA Brasil, diretório e newsletter semanal de ferramentas de IA para contadores e PMEs brasileiras. 78% dos contadores já usam IA toda semana e 68% não têm capacitação (IOB/CFC/Fenacon, 2026). Nosso leitor está escolhendo ferramentas agora. Tenho vagas de patrocínio para [mês]: destaque no topo da categoria [Fiscal/ERP] + menção na newsletter. Topa uma conversa de 15 min? Mando o mídia kit com os números atuais.';
