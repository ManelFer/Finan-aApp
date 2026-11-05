import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Income, Debt, Investment, FinancialSummary } from '../types/finance';
import { StorageService } from '../services/storage';

interface FinanceContextData {
  incomes: Income[];
  debts: Debt[];
  investments: Investment[];
  emergencyGoal: number;
  summary: FinancialSummary;
  isLoading: boolean;
  loadError: string | null;
  reloadData: () => Promise<void>;
  addIncome: (income: Omit<Income, 'id'>) => Promise<void>;
  updateIncome: (income: Income) => Promise<void>;
  deleteIncome: (id: string) => Promise<void>;
  addDebt: (debt: Omit<Debt, 'id' | 'createdAt'>) => Promise<void>;
  updateDebt: (debt: Debt) => Promise<void>;
  deleteDebt: (id: string) => Promise<void>;
  toggleDebtPaid: (id: string) => Promise<void>;
  addInvestment: (investment: Omit<Investment, 'id' | 'updatedAt'>) => Promise<void>;
  updateInvestment: (investment: Investment) => Promise<void>;
  deleteInvestment: (id: string) => Promise<void>;
  updateEmergencyGoal: (goal: number) => Promise<void>;
  resetAllData: () => Promise<void>;
}

const FinanceContext = createContext<FinanceContextData>({} as FinanceContextData);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [emergencyGoal, setEmergencyGoal] = useState<number>(10000);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadAllData = useCallback(async () => {
    try {
      await StorageService.removeLegacyDemoData();
      const [storedIncomes, storedDebts, storedInvestments, storedGoal] = await Promise.all([
        StorageService.getIncomes(),
        StorageService.getDebts(),
        StorageService.getInvestments(),
        StorageService.getEmergencyGoal(),
      ]);

      setIncomes(storedIncomes);
      setDebts(storedDebts);
      setInvestments(storedInvestments);
      setEmergencyGoal(storedGoal);
    } catch (e) {
      console.error('Failed to load initial data', e);
      setLoadError(
        e instanceof Error ? e.message : 'Ocorreu um erro inesperado ao carregar seus dados.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reloadData = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    await loadAllData();
  }, [loadAllData]);

  useEffect(() => {
    void Promise.resolve().then(loadAllData);
  }, [loadAllData]);

  const addIncome = async (incomeData: Omit<Income, 'id'>) => {
    const newIncome: Income = {
      ...incomeData,
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    };
    const updated = [newIncome, ...incomes];
    setIncomes(updated);
    await StorageService.saveIncomes(updated);
  };

  const updateIncome = async (updatedIncome: Income) => {
    const updated = incomes.map((item) => (item.id === updatedIncome.id ? updatedIncome : item));
    setIncomes(updated);
    await StorageService.saveIncomes(updated);
  };

  const deleteIncome = async (id: string) => {
    const updated = incomes.filter((item) => item.id !== id);
    setIncomes(updated);
    await StorageService.saveIncomes(updated);
  };

  const addDebt = async (debtData: Omit<Debt, 'id' | 'createdAt'>) => {
    const newDebt: Debt = {
      ...debtData,
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
    };
    const updated = [newDebt, ...debts];
    setDebts(updated);
    await StorageService.saveDebts(updated);
  };

  const updateDebt = async (updatedDebt: Debt) => {
    const updated = debts.map((item) => (item.id === updatedDebt.id ? updatedDebt : item));
    setDebts(updated);
    await StorageService.saveDebts(updated);
  };

  const deleteDebt = async (id: string) => {
    const updated = debts.filter((item) => item.id !== id);
    setDebts(updated);
    await StorageService.saveDebts(updated);
  };

  const toggleDebtPaid = async (id: string) => {
    const updated = debts.map((item) => {
      if (item.id === id) {
        const nextPaid = !item.isPaidThisMonth;
        let paidInstallments = item.paidInstallments;
        if (nextPaid && paidInstallments < item.totalInstallments) {
          paidInstallments += 1;
        } else if (!nextPaid && paidInstallments > 0) {
          paidInstallments -= 1;
        }
        return {
          ...item,
          isPaidThisMonth: nextPaid,
          paidInstallments,
        };
      }
      return item;
    });
    setDebts(updated);
    await StorageService.saveDebts(updated);
  };

  const addInvestment = async (invData: Omit<Investment, 'id' | 'updatedAt'>) => {
    const newInv: Investment = {
      ...invData,
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newInv, ...investments];
    setInvestments(updated);
    await StorageService.saveInvestments(updated);
  };

  const updateInvestment = async (updatedInv: Investment) => {
    const updated = investments.map((item) =>
      item.id === updatedInv.id ? { ...updatedInv, updatedAt: new Date().toISOString() } : item
    );
    setInvestments(updated);
    await StorageService.saveInvestments(updated);
  };

  const deleteInvestment = async (id: string) => {
    const updated = investments.filter((item) => item.id !== id);
    setInvestments(updated);
    await StorageService.saveInvestments(updated);
  };

  const updateEmergencyGoal = async (goal: number) => {
    setEmergencyGoal(goal);
    await StorageService.saveEmergencyGoal(goal);
  };

  const resetAllData = async () => {
    setIsLoading(true);
    await StorageService.clearAllData();
    setIncomes([]);
    setDebts([]);
    setInvestments([]);
    setEmergencyGoal(10000);
    setIsLoading(false);
  };

  // Calculations for summary
  const summary: FinancialSummary = useMemo(() => {
    const totalMonthlyIncome = incomes.reduce((acc, curr) => {
      if (curr.frequency === 'mensal') return acc + curr.amount;
      if (curr.frequency === 'quinzenal') return acc + curr.amount * 2;
      if (curr.frequency === 'semanal') return acc + curr.amount * 4.33;
      return acc + curr.amount; // unico
    }, 0);

    const totalMonthlyDebt = debts.reduce((acc, curr) => {
      // Sum the monthly commitment of debts
      return acc + curr.installmentValue;
    }, 0);

    const netMonthlyBalance = totalMonthlyIncome - totalMonthlyDebt;

    const totalInvested = investments.reduce((acc, curr) => acc + curr.currentAmount, 0);

    const debtRatioPercentage =
      totalMonthlyIncome > 0 ? (totalMonthlyDebt / totalMonthlyIncome) * 100 : 0;

    const emergencyFundCurrent = investments
      .filter((i) => i.category === 'reserva_emergencia')
      .reduce((acc, curr) => acc + curr.currentAmount, 0);

    return {
      totalMonthlyIncome,
      totalMonthlyDebt,
      netMonthlyBalance,
      totalInvested,
      debtRatioPercentage,
      emergencyFundCurrent,
      emergencyFundGoal: emergencyGoal,
    };
  }, [incomes, debts, investments, emergencyGoal]);

  return (
    <FinanceContext.Provider
      value={{
        incomes,
        debts,
        investments,
        emergencyGoal,
        summary,
        isLoading,
        loadError,
        reloadData,
        addIncome,
        updateIncome,
        deleteIncome,
        addDebt,
        updateDebt,
        deleteDebt,
        toggleDebtPaid,
        addInvestment,
        updateInvestment,
        deleteInvestment,
        updateEmergencyGoal,
        resetAllData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);
