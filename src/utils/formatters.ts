export const formatCurrency = (value: number): string => {
  if (isNaN(value)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatPercent = (value: number): string => {
  if (isNaN(value)) return '0%';
  return `${value.toFixed(1).replace('.', ',')}%`;
};

export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    // Incomes
    salario: 'Salário Principal',
    freelance: 'Freelance / Bico',
    investimentos: 'Rendimentos',
    beneficios: 'Benefícios / VR',
    // Debts
    cartao: 'Cartão de Crédito',
    emprestimo: 'Empréstimo',
    financiamento: 'Financiamento',
    contas_fixas: 'Contas Fixas',
    // Investments
    renda_fixa: 'Renda Fixa / CDB',
    acoes: 'Ações',
    fiis: 'Fundos Imobiliários (FIIs)',
    tesouro_direto: 'Tesouro Direto',
    cripto: 'Criptomoedas',
    reserva_emergencia: 'Reserva de Emergência',
    outros: 'Outros',
  };
  return labels[category] || category;
};

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    salario: '#10B981',
    freelance: '#06B6D4',
    investimentos: '#8B5CF6',
    beneficios: '#F59E0B',
    cartao: '#EF4444',
    emprestimo: '#F97316',
    financiamento: '#EC4899',
    contas_fixas: '#64748B',
    renda_fixa: '#3B82F6',
    acoes: '#10B981',
    fiis: '#8B5CF6',
    tesouro_direto: '#F59E0B',
    cripto: '#EC4899',
    reserva_emergencia: '#14B8A6',
    outros: '#94A3B8',
  };
  return colors[category] || '#64748B';
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
};
