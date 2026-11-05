import AsyncStorage from '@react-native-async-storage/async-storage';
import { Income, Debt, Investment } from '../types/finance';

const KEYS = {
  INCOMES: '@finan_incomes',
  DEBTS: '@finan_debts',
  INVESTMENTS: '@finan_investments',
  EMERGENCY_GOAL: '@finan_emergency_goal',
};

export const StorageService = {
  async getIncomes(): Promise<Income[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.INCOMES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error loading incomes', e);
      throw e;
    }
  },

  async saveIncomes(incomes: Income[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.INCOMES, JSON.stringify(incomes));
    } catch (e) {
      console.error('Error saving incomes', e);
    }
  },

  async getDebts(): Promise<Debt[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.DEBTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error loading debts', e);
      throw e;
    }
  },

  async saveDebts(debts: Debt[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.DEBTS, JSON.stringify(debts));
    } catch (e) {
      console.error('Error saving debts', e);
    }
  },

  async getInvestments(): Promise<Investment[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.INVESTMENTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error loading investments', e);
      throw e;
    }
  },

  async saveInvestments(investments: Investment[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.INVESTMENTS, JSON.stringify(investments));
    } catch (e) {
      console.error('Error saving investments', e);
    }
  },

  async getEmergencyGoal(): Promise<number> {
    try {
      const data = await AsyncStorage.getItem(KEYS.EMERGENCY_GOAL);
      return data ? parseFloat(data) : 10000;
    } catch (e) {
      console.error('Error loading emergency goal', e);
      throw e;
    }
  },

  async saveEmergencyGoal(goal: number): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.EMERGENCY_GOAL, goal.toString());
    } catch (e) {
      console.error('Error saving emergency goal', e);
    }
  },

  async removeLegacyDemoData(): Promise<void> {
    const [incomes, debts, investments] = await Promise.all([
      this.getIncomes(),
      this.getDebts(),
      this.getInvestments(),
    ]);
    const cleanIncomes = incomes.filter((income) => !['inc-1', 'inc-2'].includes(income.id));
    const cleanDebts = debts.filter((debt) => !['debt-1', 'debt-2'].includes(debt.id));
    const cleanInvestments = investments.filter(
      (investment) => !['inv-1', 'inv-2', 'inv-3'].includes(investment.id)
    );

    await Promise.all([
      cleanIncomes.length !== incomes.length ? this.saveIncomes(cleanIncomes) : Promise.resolve(),
      cleanDebts.length !== debts.length ? this.saveDebts(cleanDebts) : Promise.resolve(),
      cleanInvestments.length !== investments.length
        ? this.saveInvestments(cleanInvestments)
        : Promise.resolve(),
    ]);
  },

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        KEYS.INCOMES,
        KEYS.DEBTS,
        KEYS.INVESTMENTS,
        KEYS.EMERGENCY_GOAL,
      ]);
    } catch (e) {
      console.error('Error clearing data', e);
    }
  },

};
