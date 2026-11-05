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
import { formatCurrency, formatPercent, getCategoryLabel, getCategoryColor } from '../utils/formatters';
import { Investment, InvestmentCategory } from '../types/finance';
import { AddInvestmentModal } from '../components/AddInvestmentModal';
import { EditInvestmentModal } from '../components/EditInvestmentModal';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';

const CATEGORY_ORDER: InvestmentCategory[] = [
  'reserva_emergencia',
  'renda_fixa',
  'tesouro_direto',
  'acoes',
  'fiis',
  'cripto',
  'outros',
];

export const InvestmentsScreen: React.FC = () => {
  const { investments, deleteInvestment, summary } = useFinance();
  const { horizontalPadding, maxContentWidth, contentWidth } = useResponsiveLayout();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);

  const handleDelete = (inv: Investment) => {
    Alert.alert(
      'Remover Ativo',
      `Deseja remover "${inv.name}" da carteira?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => deleteInvestment(inv.id),
        },
      ]
    );
  };

  // Group by category for breakdown
  const categoryBreakdown = CATEGORY_ORDER
    .map((cat) => {
      const items = investments.filter((i) => i.category === cat);
      const total = items.reduce((acc, i) => acc + i.currentAmount, 0);
      return { cat, total, count: items.length };
    })
    .filter((c) => c.count > 0);

  const profitLoss = investments.reduce(
    (acc, i) => acc + (i.currentAmount - i.investedAmount),
    0
  );
  const profitLossPct =
    summary.totalInvested > 0
      ? (profitLoss / investments.reduce((acc, i) => acc + i.investedAmount, 0)) * 100
      : 0;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingHorizontal: horizontalPadding,
            maxWidth: maxContentWidth,
            width: contentWidth,
            alignSelf: 'center',
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Carteira de Investimentos</Text>
          <Text style={styles.pageSubtitle}>{investments.length} ativo{investments.length !== 1 ? 's' : ''}</Text>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryBlock}>
              <Text style={styles.summaryLabel}>Total Investido</Text>
              <Text style={styles.summaryValue}>{formatCurrency(summary.totalInvested)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryBlock}>
              <Text style={styles.summaryLabel}>Resultado</Text>
              <Text style={[styles.summaryPnL, { color: profitLoss >= 0 ? '#10B981' : '#EF4444' }]}>
                {profitLoss >= 0 ? '+' : ''}{formatCurrency(profitLoss)}
              </Text>
              <Text style={[styles.summaryPnLPct, { color: profitLoss >= 0 ? '#6EE7B7' : '#FCA5A5' }]}>
                {profitLoss >= 0 ? '+' : ''}{formatPercent(profitLossPct)}
              </Text>
            </View>
          </View>
        </View>

        {/* Category Breakdown */}
        {categoryBreakdown.length > 0 && (
          <View style={styles.breakdownCard}>
            <Text style={styles.sectionTitle}>Por Categoria</Text>
            {categoryBreakdown.map(({ cat, total }) => {
              const pct = summary.totalInvested > 0 ? (total / summary.totalInvested) * 100 : 0;
              const color = getCategoryColor(cat);
              return (
                <View key={cat} style={styles.breakdownItem}>
                  <View style={styles.breakdownLeft}>
                    <View style={[styles.catDot, { backgroundColor: color }]} />
                    <Text style={styles.breakdownLabel}>{getCategoryLabel(cat)}</Text>
                  </View>
                  <View style={styles.breakdownRight}>
                    <Text style={styles.breakdownAmount}>{formatCurrency(total)}</Text>
                    <Text style={[styles.breakdownPct, { color }]}>{pct.toFixed(1)}%</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Investments List */}
        <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>Todos os Ativos</Text>

        {investments.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="trending-up-outline" size={48} color="#334155" />
            <Text style={styles.emptyTitle}>Nenhum investimento ainda</Text>
            <Text style={styles.emptySub}>{'Toque no "+" para adicionar seu primeiro ativo.'}</Text>
          </View>
        ) : (
          investments.map((item) => {
            const catColor = getCategoryColor(item.category);
            const gain = item.currentAmount - item.investedAmount;
            const gainPct = item.investedAmount > 0 ? (gain / item.investedAmount) * 100 : 0;
            const hasTarget = item.targetAmount && item.targetAmount > 0;
            const targetPct = hasTarget
              ? Math.min(100, (item.currentAmount / item.targetAmount!) * 100)
              : null;

            return (
              <View key={item.id} style={styles.itemCard}>
                <View style={styles.itemTopRow}>
                  <View style={styles.itemLeft}>
                    <View style={[styles.catDotLarge, { backgroundColor: catColor }]} />
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      {item.ticker ? (
                        <Text style={styles.itemTicker}>{item.ticker}</Text>
                      ) : null}
                      <View style={styles.itemMeta}>
                        <View style={[styles.badge, { backgroundColor: catColor + '22', borderColor: catColor + '55' }]}>
                          <Text style={[styles.badgeText, { color: catColor }]}>
                            {getCategoryLabel(item.category)}
                          </Text>
                        </View>
                        {item.broker ? (
                          <Text style={styles.itemBroker}>{item.broker}</Text>
                        ) : null}
                      </View>
                    </View>
                  </View>

                  <View style={styles.itemRight}>
                    <Text style={styles.itemAmount}>{formatCurrency(item.currentAmount)}</Text>
                    <Text style={[styles.itemGain, { color: gain >= 0 ? '#10B981' : '#EF4444' }]}>
                      {gain >= 0 ? '+' : ''}{formatPercent(gainPct)}
                    </Text>
                    <View style={styles.itemActions}>
                      <TouchableOpacity
                        style={styles.editBtn}
                        onPress={() => setEditingInvestment(item)}
                      >
                        <Ionicons name="pencil" size={15} color="#94A3B8" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => handleDelete(item)}
                      >
                        <Ionicons name="trash" size={15} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Target progress */}
                {targetPct !== null && (
                  <View style={styles.progressWrapper}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${targetPct}%`, backgroundColor: catColor },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      Meta: {formatCurrency(item.targetAmount!)} • {targetPct.toFixed(0)}%
                    </Text>
                  </View>
                )}

                {item.expectedAnnualYield ? (
                  <Text style={styles.yieldText}>
                    Rendimento esperado: {formatPercent(item.expectedAnnualYield)} a.a.
                  </Text>
                ) : null}
              </View>
            );
          })
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setAddModalVisible(true)}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Modals */}
      <AddInvestmentModal visible={addModalVisible} onClose={() => setAddModalVisible(false)} />
      <EditInvestmentModal
        visible={editingInvestment !== null}
        investment={editingInvestment}
        onClose={() => setEditingInvestment(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    padding: 18,
    paddingBottom: 20,
  },
  pageHeader: {
    marginBottom: 16,
    marginTop: 6,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  summaryCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryBlock: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 48,
    backgroundColor: '#334155',
    marginHorizontal: 8,
  },
  summaryLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  summaryValue: {
    color: '#818CF8',
    fontSize: 18,
    fontWeight: '900',
  },
  summaryPnL: {
    fontSize: 16,
    fontWeight: '800',
  },
  summaryPnLPct: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  breakdownCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 10,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  catDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  breakdownLabel: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  breakdownRight: {
    alignItems: 'flex-end',
  },
  breakdownAmount: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  breakdownPct: {
    fontSize: 11,
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 36,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    marginTop: 20,
  },
  emptyTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
  emptySub: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
  },
  itemCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  itemTopRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    flex: 1,
    minWidth: 170,
  },
  catDotLarge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 3,
  },
  itemInfo: {
    flex: 1,
    gap: 4,
  },
  itemName: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  itemTicker: {
    color: '#818CF8',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  itemBroker: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '500',
  },
  itemRight: {
    alignItems: 'flex-end',
    gap: 4,
    flexShrink: 1,
  },
  itemAmount: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '800',
  },
  itemGain: {
    fontSize: 12,
    fontWeight: '700',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  editBtn: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    padding: 6,
  },
  deleteBtn: {
    backgroundColor: '#450A0A',
    borderWidth: 1,
    borderColor: '#7F1D1D',
    borderRadius: 8,
    padding: 6,
  },
  progressWrapper: {
    marginTop: 10,
    gap: 4,
  },
  progressBar: {
    height: 5,
    backgroundColor: '#0F172A',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    color: '#64748B',
    fontSize: 11,
    textAlign: 'right',
  },
  yieldText: {
    color: '#6EE7B7',
    fontSize: 11,
    marginTop: 6,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    backgroundColor: '#6366F1',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#818CF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
});
