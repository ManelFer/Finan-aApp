export type IncomeCategory = 'salario' | 'freelance' | 'investimentos' | 'beneficios' | 'outros';

export interface Income {
  id: string;
  title: string;
  amount: number;
  frequency: 'mensal' | 'quinzenal' | 'semanal' | 'unico';
  receiveDay?: number;
  category: IncomeCategory;
  date: string;
}

export type DebtCategory = 'cartao' | 'emprestimo' | 'financiamento' | 'contas_fixas' | 'outros';

export interface Debt {
  id: string;
  title: string;
  totalAmount: number;
  installmentValue: number;
  totalInstallments: number;
  paidInstallments: number;
  dueDay: number;
  interestRate?: number; // % ao mês
  category: DebtCategory;
  isPaidThisMonth: boolean;
  notes?: string;
  createdAt: string;
}

export type InvestmentCategory = 'renda_fixa' | 'acoes' | 'fiis' | 'tesouro_direto' | 'cripto' | 'reserva_emergencia' | 'outros';

export interface Investment {
  id: string;
  name: string;
  ticker?: string;
  category: InvestmentCategory;
  investedAmount: number;
  currentAmount: number;
  targetAmount?: number;
  monthlyContribution?: number;
  expectedAnnualYield?: number; // % a.a.
  broker?: string;
  updatedAt: string;
}

export interface FinancialSummary {
  totalMonthlyIncome: number;
  totalMonthlyDebt: number;
  netMonthlyBalance: number;
  totalInvested: number;
  debtRatioPercentage: number;
  emergencyFundCurrent: number;
  emergencyFundGoal: number;
}
