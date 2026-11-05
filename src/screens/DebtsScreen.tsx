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
import { formatCurrency, getCategoryLabel, getCategoryColor } from '../utils/formatters';
import { Debt } from '../types/finance';
import { AddDebtModal } from '../components/AddDebtModal';
import { EditDebtModal } from '../components/EditDebtModal';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';

export const DebtsScreen: React.FC = () => {
  const { debts, deleteDebt, toggleDebtPaid, summary } = useFinance();
  const { horizontalPadding, maxContentWidth, contentWidth } = useResponsiveLayout();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);

  const pendingCount = debts.filter((d) => !d.isPaidThisMonth).length;
  const paidCount = debts.filter((d) => d.isPaidThisMonth).length;

  const handleDelete = (debt: Debt) => {
    Alert.alert(
      'Remover Dívida',
      `Deseja remover "${debt.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => deleteDebt(debt.id),
        },
      ]
    );
  };

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
          <Text style={styles.pageTitle}>Dívidas & Parcelas</Text>
          <Text style={styles.pageSubtitle}>{debts.length} compromisso{debts.length !== 1 ? 's' : ''}</Text>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryBlock}>
              <Text style={styles.summaryLabel}>Total Mensal</Text>
              <Text style={styles.summaryValueRed}>{formatCurrency(summary.totalMonthlyDebt)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryBlock}>
              <Text style={styles.summaryLabel}>Pendentes</Text>
              <Text style={[styles.summaryCount, { color: '#FCA5A5' }]}>{pendingCount}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryBlock}>
              <Text style={styles.summaryLabel}>Pagos</Text>
              <Text style={[styles.summaryCount, { color: '#10B981' }]}>{paidCount}</Text>
            </View>
          </View>
        </View>

        {/* List */}
        {debts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-done-circle-outline" size={48} color="#334155" />
            <Text style={styles.emptyTitle}>Sem dívidas cadastradas</Text>
            <Text style={styles.emptySub}>{'Toque no "+" para registrar uma dívida ou parcela.'}</Text>
          </View>
        ) : (
          debts.map((item) => {
            const catColor = getCategoryColor(item.category);
            const progress = item.totalInstallments > 1
              ? item.paidInstallments / item.totalInstallments
              : item.isPaidThisMonth ? 1 : 0;

            return (
              <View
                key={item.id}
                style={[
                  styles.itemCard,
                  item.isPaidThisMonth && styles.itemCardPaid,
                ]}
              >
                {/* Top row */}
                <View style={styles.itemTopRow}>
                  <View style={styles.itemLeft}>
                    <View style={styles.dueBadge}>
                      <Text style={styles.dueBadgeText}>Dia {item.dueDay}</Text>
                    </View>
                    <View style={styles.itemInfo}>
                      <Text style={[styles.itemTitle, item.isPaidThisMonth && styles.itemTitlePaid]}>
                        {item.title}
                      </Text>
                      <View style={[styles.badge, { backgroundColor: catColor + '22', borderColor: catColor + '55' }]}>
                        <Text style={[styles.badgeText, { color: catColor }]}>
                          {getCategoryLabel(item.category)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.itemRight}>
                    <Text style={styles.itemAmount}>{formatCurrency(item.installmentValue)}</Text>
                    <View style={styles.itemActions}>
                      <TouchableOpacity
                        style={styles.editBtn}
                        onPress={() => setEditingDebt(item)}
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

                {/* Progress */}
                {item.totalInstallments > 1 && (
                  <View style={styles.progressWrapper}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${Math.min(100, progress * 100)}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {item.paidInstallments}/{item.totalInstallments} parcelas
                    </Text>
                  </View>
                )}

                {/* Toggle paid */}
                <TouchableOpacity
                  style={[
                    styles.paidToggle,
                    item.isPaidThisMonth && styles.paidToggleActive,
                  ]}
                  onPress={() => toggleDebtPaid(item.id)}
                >
                  <Ionicons
                    name={item.isPaidThisMonth ? 'checkmark-circle' : 'ellipse-outline'}
                    size={16}
                    color={item.isPaidThisMonth ? '#0F172A' : '#64748B'}
                  />
                  <Text
                    style={[
                      styles.paidToggleText,
                      item.isPaidThisMonth && styles.paidToggleTextActive,
                    ]}
                  >
                    {item.isPaidThisMonth ? 'Pago este mês' : 'Marcar como pago'}
                  </Text>
                </TouchableOpacity>
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
      <AddDebtModal visible={addModalVisible} onClose={() => setAddModalVisible(false)} />
      <EditDebtModal
        visible={editingDebt !== null}
        debt={editingDebt}
        onClose={() => setEditingDebt(null)}
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
    marginBottom: 20,
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
    height: 36,
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
  summaryValueRed: {
    color: '#EF4444',
    fontSize: 18,
    fontWeight: '900',
  },
  summaryCount: {
    fontSize: 22,
    fontWeight: '900',
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
  itemCardPaid: {
    opacity: 0.7,
    borderColor: '#1E3A2A',
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
  dueBadge: {
    backgroundColor: '#450A0A',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginTop: 2,
  },
  dueBadgeText: {
    color: '#FCA5A5',
    fontSize: 11,
    fontWeight: '700',
  },
  itemInfo: {
    flex: 1,
    gap: 5,
  },
  itemTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  itemTitlePaid: {
    color: '#64748B',
    textDecorationLine: 'line-through',
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  itemRight: {
    alignItems: 'flex-end',
    gap: 6,
    flexShrink: 1,
  },
  itemAmount: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '800',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 6,
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
    backgroundColor: '#EF4444',
    borderRadius: 3,
  },
  progressText: {
    color: '#64748B',
    fontSize: 11,
    textAlign: 'right',
  },
  paidToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#0F172A',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    alignSelf: 'flex-start',
  },
  paidToggleActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  paidToggleText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
  paidToggleTextActive: {
    color: '#0F172A',
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    backgroundColor: '#EF4444',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
});
