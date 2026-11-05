import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { AddIncomeModal } from '../components/AddIncomeModal';
import { AddDebtModal } from '../components/AddDebtModal';
import { AddInvestmentModal } from '../components/AddInvestmentModal';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';

interface Props {
  onNavigateTab: (tab: 'incomes' | 'debts' | 'investments' | 'tools') => void;
}

export const DashboardScreen: React.FC<Props> = ({ onNavigateTab }) => {
  const { summary, debts, investments, toggleDebtPaid, resetAllData } = useFinance();
  const { horizontalPadding, maxContentWidth, contentWidth } = useResponsiveLayout();
  const [incomeModal, setIncomeModal] = useState(false);
  const [debtModal, setDebtModal] = useState(false);
  const [investmentModal, setInvestmentModal] = useState(false);

  // Status of debt ratio
  const ratio = summary.debtRatioPercentage;
  let ratioColor = '#10B981'; // safe
  let ratioLabel = 'Excelente (< 30%)';
  if (ratio > 50) {
    ratioColor = '#EF4444';
    ratioLabel = 'Alto risco (> 50%)';
  } else if (ratio > 30) {
    ratioColor = '#F59E0B';
    ratioLabel = 'Moderado (30% a 50%)';
  }

  // Pending debts
  const pendingDebts = debts.filter((d) => !d.isPaidThisMonth);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          paddingHorizontal: horizontalPadding,
          maxWidth: maxContentWidth,
          width: contentWidth,
          alignSelf: 'center',
        },
      ]}
    >
      {/* Top Welcome / Header */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.greeting}>Painel Financeiro</Text>
          <Text style={styles.subGreeting}>Controle, quitação e multiplicação</Text>
        </View>
        <TouchableOpacity
          style={styles.moreOptionsBtn}
          onPress={() => {
            Alert.alert(
              'Opções Rápidas',
              'O que deseja fazer?',
              [
                { text: 'Zerar Todos os Dados', onPress: resetAllData, style: 'destructive' },
                { text: 'Cancelar', style: 'cancel' },
              ]
            );
          }}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      {/* Main Net Balance Card */}
      <View style={styles.mainCard}>
        <Text style={styles.mainCardLabel}>Saldo Livre no Mês (Salário - Dívidas)</Text>
        <Text
          style={[
            styles.mainCardValue,
            { color: summary.netMonthlyBalance >= 0 ? '#10B981' : '#EF4444' },
          ]}
        >
          {formatCurrency(summary.netMonthlyBalance)}
        </Text>
        <Text style={styles.mainCardSub}>
          {summary.netMonthlyBalance >= 0
            ? 'Disponível para despesas pessoais e novos aportes'
            : 'Atenção: seus compromissos excedem sua renda neste mês'}
        </Text>

        {/* Debt ratio bar */}
        <View style={styles.ratioWrapper}>
          <View style={styles.ratioHeader}>
            <Text style={styles.ratioTitle}>Comprometimento com Dívidas</Text>
            <Text style={[styles.ratioValue, { color: ratioColor }]}>
              {formatPercent(ratio)} • {ratioLabel}
            </Text>
          </View>
          <View style={styles.barBackground}>
            <View
              style={[
                styles.barProgress,
                { width: `${Math.min(100, ratio)}%`, backgroundColor: ratioColor },
              ]}
            />
          </View>
        </View>
      </View>

      {/* 3 Metric Mini Cards */}
      <View style={styles.metricsRow}>
        <TouchableOpacity
          style={styles.metricCard}
          onPress={() => onNavigateTab('incomes')}
        >
          <View style={[styles.metricIcon, { backgroundColor: '#064E3B' }]}>
            <Ionicons name="arrow-down-circle" size={18} color="#10B981" />
          </View>
          <Text style={styles.metricLabel}>Renda Total</Text>
          <Text style={styles.metricValueGreen}>{formatCurrency(summary.totalMonthlyIncome)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.metricCard}
          onPress={() => onNavigateTab('debts')}
        >
          <View style={[styles.metricIcon, { backgroundColor: '#450A0A' }]}>
            <Ionicons name="arrow-up-circle" size={18} color="#EF4444" />
          </View>
          <Text style={styles.metricLabel}>Dívidas Mês</Text>
          <Text style={styles.metricValueRed}>{formatCurrency(summary.totalMonthlyDebt)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.metricCard}
          onPress={() => onNavigateTab('investments')}
        >
          <View style={[styles.metricIcon, { backgroundColor: '#312E81' }]}>
            <Ionicons name="trending-up" size={18} color="#818CF8" />
          </View>
          <Text style={styles.metricLabel}>Investimentos</Text>
          <Text style={styles.metricValuePurple}>{formatCurrency(summary.totalInvested)}</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Action Buttons */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[styles.actionBtn, { borderColor: '#10B981' }]}
          onPress={() => setIncomeModal(true)}
        >
          <Ionicons name="add" size={18} color="#10B981" />
          <Text style={[styles.actionBtnText, { color: '#10B981' }]}>Salário / Renda</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, { borderColor: '#EF4444' }]}
          onPress={() => setDebtModal(true)}
        >
          <Ionicons name="add" size={18} color="#EF4444" />
          <Text style={[styles.actionBtnText, { color: '#EF4444' }]}>Dívida / Conta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, { borderColor: '#6366F1' }]}
          onPress={() => setInvestmentModal(true)}
        >
          <Ionicons name="add" size={18} color="#6366F1" />
          <Text style={[styles.actionBtnText, { color: '#818CF8' }]}>Investimento</Text>
        </TouchableOpacity>
      </View>

      {/* Emergency Fund Highlight Card */}
      <TouchableOpacity
        style={styles.emergencyCard}
        onPress={() => onNavigateTab('tools')}
      >
        <View style={styles.emergencyHeader}>
          <View style={styles.emergencyLeft}>
            <Ionicons name="shield-checkmark" size={22} color="#14B8A6" />
            <Text style={styles.emergencyTitle}>Reserva de Emergência</Text>
          </View>
          <Text style={styles.emergencyPercent}>
            {summary.emergencyFundGoal > 0
              ? `${Math.min(100, (summary.emergencyFundCurrent / summary.emergencyFundGoal) * 100).toFixed(0)}%`
              : '0%'}
          </Text>
        </View>
        <Text style={styles.emergencyAmounts}>
          Guardado: {formatCurrency(summary.emergencyFundCurrent)} / Meta: {formatCurrency(summary.emergencyFundGoal)}
        </Text>
        <View style={styles.emergencyBarTrack}>
          <View
            style={[
              styles.emergencyBarFill,
              {
                width: `${Math.min(
                  100,
                  summary.emergencyFundGoal > 0
                    ? (summary.emergencyFundCurrent / summary.emergencyFundGoal) * 100
                    : 0
                )}%`,
              },
            ]}
          />
        </View>
      </TouchableOpacity>

      {/* Pending Debts Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Vencimentos Pendentes ({pendingDebts.length})
        </Text>
        <TouchableOpacity onPress={() => onNavigateTab('debts')}>
          <Text style={styles.sectionLink}>Ver todas</Text>
        </TouchableOpacity>
      </View>

      {pendingDebts.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="checkmark-done-circle" size={36} color="#10B981" />
          <Text style={styles.emptyTitle}>Tudo pago este mês!</Text>
          <Text style={styles.emptySub}>Nenhuma dívida ou parcela pendente para este mês.</Text>
        </View>
      ) : (
        pendingDebts.slice(0, 3).map((item) => (
          <View key={item.id} style={styles.debtItemCard}>
            <View style={styles.debtItemLeft}>
              <View style={styles.debtDueBadge}>
                <Text style={styles.debtDueDay}>Dia {item.dueDay}</Text>
              </View>
              <View>
                <Text style={styles.debtItemTitle}>{item.title}</Text>
                <Text style={styles.debtItemInstallment}>
                  Parcela: {formatCurrency(item.installmentValue)}
                  {item.totalInstallments > 1 && ` (${item.paidInstallments}/${item.totalInstallments})`}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.payBtn}
              onPress={() => toggleDebtPaid(item.id)}
            >
              <Ionicons name="checkbox-outline" size={16} color="#0F172A" />
              <Text style={styles.payBtnText}>Pagar</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      {/* Investments Teaser Section */}
      <View style={[styles.sectionHeader, { marginTop: 24 }]}>
        <Text style={styles.sectionTitle}>Sua Carteira de Ativos</Text>
        <TouchableOpacity onPress={() => onNavigateTab('investments')}>
          <Text style={styles.sectionLink}>Ver carteira</Text>
        </TouchableOpacity>
      </View>

      {investments.slice(0, 3).map((inv) => (
        <View key={inv.id} style={styles.investCard}>
          <View>
            <Text style={styles.investName}>{inv.name}</Text>
            <Text style={styles.investYield}>
              {inv.broker ? `${inv.broker} • ` : ''}
              {inv.expectedAnnualYield ? `${inv.expectedAnnualYield}% a.a.` : 'Rendimento variável'}
            </Text>
          </View>
          <Text style={styles.investAmount}>{formatCurrency(inv.currentAmount)}</Text>
        </View>
      ))}

      {/* Modals */}
      <AddIncomeModal visible={incomeModal} onClose={() => setIncomeModal(false)} />
      <AddDebtModal visible={debtModal} onClose={() => setDebtModal(false)} />
      <AddInvestmentModal visible={investmentModal} onClose={() => setInvestmentModal(false)} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    padding: 18,
    paddingBottom: 40,
  },
  topHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    marginTop: 6,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  subGreeting: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  moreOptionsBtn: {
    padding: 8,
    backgroundColor: '#1E293B',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  mainCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  mainCardLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mainCardValue: {
    fontSize: 32,
    fontWeight: '900',
    marginVertical: 4,
  },
  mainCardSub: {
    color: '#CBD5E1',
    fontSize: 13,
    marginBottom: 14,
  },
  ratioWrapper: {
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 12,
  },
  ratioHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 4,
    marginBottom: 6,
  },
  ratioTitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
  },
  ratioValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  barBackground: {
    height: 6,
    backgroundColor: '#0F172A',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barProgress: {
    height: '100%',
    borderRadius: 3,
  },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    flexBasis: '30%',
    minWidth: 120,
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  metricIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  metricValueGreen: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  metricValueRed: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  metricValuePurple: {
    color: '#818CF8',
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  actionBtn: {
    flex: 1,
    flexBasis: 140,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: '#1E293B',
    borderRadius: 10,
    borderWidth: 1,
    gap: 4,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'center',
  },
  emergencyCard: {
    backgroundColor: '#042F2E',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#115E59',
    marginBottom: 20,
  },
  emergencyHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  emergencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    flexShrink: 1,
  },
  emergencyTitle: {
    color: '#F0FDFA',
    fontSize: 15,
    fontWeight: '700',
    flexShrink: 1,
  },
  emergencyPercent: {
    color: '#14B8A6',
    fontSize: 16,
    fontWeight: '800',
  },
  emergencyAmounts: {
    color: '#99F6E4',
    fontSize: 12,
    marginBottom: 8,
  },
  emergencyBarTrack: {
    height: 6,
    backgroundColor: '#134E4A',
    borderRadius: 3,
    overflow: 'hidden',
  },
  emergencyBarFill: {
    height: '100%',
    backgroundColor: '#14B8A6',
  },
  sectionHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  sectionLink: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  emptyTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 8,
  },
  emptySub: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  debtItemCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  debtItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 180,
  },
  debtDueBadge: {
    backgroundColor: '#450A0A',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  debtDueDay: {
    color: '#FCA5A5',
    fontSize: 12,
    fontWeight: '700',
  },
  debtItemTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  debtItemInstallment: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  payBtn: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  payBtnText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '700',
  },
  investCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  investName: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
  },
  investYield: {
    color: '#818CF8',
    fontSize: 12,
    marginTop: 2,
  },
  investAmount: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
});
