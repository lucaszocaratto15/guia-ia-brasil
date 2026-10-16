export const categoryOrder = [
  'ERP e Gestão com IA',
  'Contabilidade e Escritório Contábil',
  'Fiscal e Tributário',
  'Financeiro e Pagamentos',
  'RH, Folha e Ponto',
  'Jurídico e Trabalhista',
  'Atendimento e WhatsApp',
  'Vendas e CRM',
  'Marketing e Conteúdo',
  'Documentos e Dados',
  'Automação e Agentes',
  'Assistentes de IA',
] as const;

export const categoryBlurbs: Record<string, string> = {
  'ERP e Gestão com IA':
    'ERPs e sistemas de gestão para financeiro, notas e a operação da PME, vários com recursos de IA.',
  'Contabilidade e Escritório Contábil':
    'Sistemas para escritórios contábeis e para empresas que terceirizam a contabilidade.',
  'Fiscal e Tributário':
    'Notas fiscais, obrigações e conteúdo tributário usados no dia a dia das empresas brasileiras.',
  'Financeiro e Pagamentos':
    'Contas, cobrança, conciliação e open finance para organizar o caixa.',
  'RH, Folha e Ponto':
    'Ponto, recrutamento e gestão de pessoas para empresas brasileiras.',
  'Jurídico e Trabalhista':
    'Consulta jurídica para decisões trabalhistas e do dia a dia da empresa.',
  'Atendimento e WhatsApp':
    'Atendimento ao cliente e automação de conversas, com foco em WhatsApp.',
  'Vendas e CRM': 'Funil de vendas e relacionamento com clientes para times comerciais.',
  'Marketing e Conteúdo': 'Peças, apresentações, vídeo e áudio para divulgar a empresa.',
  'Documentos e Dados':
    'Assinatura, leitura de documentos, atas de reunião e análise de dados.',
  'Automação e Agentes': 'Ferramentas para conectar sistemas e automatizar tarefas repetitivas.',
  'Assistentes de IA':
    'Assistentes de uso geral para pesquisar, escrever e resolver tarefas do escritório.',
};

export function categoryBlurb(name: string): string {
  return (
    categoryBlurbs[name] ??
    `Ferramentas de ${name} para PMEs, contadores e empresários no Brasil.`
  );
}
