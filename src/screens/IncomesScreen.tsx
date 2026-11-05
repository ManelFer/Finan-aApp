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
import { Income } from '../types/finance';
import { AddIncomeModal } from '../components/AddIncomeModal';
import { EditIncomeModal } from '../components/EditIncomeModal';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';

const FREQ_LABEL: Record<string, string> = {
  mensal: 'Mensal',
  quinzenal: 'Quinzenal',
  semanal: 'Semanal',
  unico: 'Único',
};

export const IncomesScreen: React.FC = () => {
  const { incomes, deleteIncome, summary } = useFinance();
  const { horizontalPadding, maxContentWidth, contentWidth } = useResponsiveLayout();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  const handleDelete = (income: Income) => {
    Alert.alert(
      'Remover Renda',
      `Deseja remover "${income.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => deleteIncome(income.id),
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
          <Text style={styles.pageTitle}>Rendas & Salários</Text>
          <Text style={styles.pageSubtitle}>{incomes.length} fonte{incomes.length !== 1 ? 's' : ''} de renda</Text>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Ionicons name="arrow-down-circle" size={28} color="#10B981" />
          </View>
          <View>
            <Text style={styles.summaryLabel}>Total Mensal</Text>
            <Text style={styles.summaryValue}>{formatCurrency(summary.totalMonthlyIncome)}</Text>
          </View>
        </View>

        {/* List */}
        {incomes.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="wallet-outline" size={48} color="#334155" />
            <Text style={styles.emptyTitle}>Nenhuma renda cadastrada</Text>
            <Text style={styles.emptySub}>{'Toque no "+" para adicionar sua renda ou salário.'}</Text>
          </View>
        ) : (
          incomes.map((item) => {
            const catColor = getCategoryColor(item.category);
            return (
              <View key={item.id} style={styles.itemCard}>
                <View style={styles.itemLeft}>
                  <View style={[styles.categoryDot, { backgroundColor: catColor }]} />
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <View style={styles.itemMeta}>
                      <View style={[styles.badge, { backgroundColor: catColor + '22', borderColor: catColor + '55' }]}>
                        <Text style={[styles.badgeText, { color: catColor }]}>
                          {getCategoryLabel(item.category)}
                        </Text>
                      </View>
                      <Text style={styles.itemFreq}>{FREQ_LABEL[item.frequency]}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.itemRight}>
                  <Text style={styles.itemAmount}>{formatCurrency(item.amount)}</Text>
                  <View style={styles.itemActions}>
                    <TouchableOpacity
                      style={styles.editBtn}
                      onPress={() => setEditingIncome(item)}
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
            );
          })
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setAddModalVisible(true)}>
        <Ionicons name="add" size={28} color="#0F172A" />
      </TouchableOpacity>

      {/* Modals */}
      <AddIncomeModal visible={addModalVisible} onClose={() => setAddModalVisible(false)} />
      <EditIncomeModal
        visible={editingIncome !== null}
        income={editingIncome}
        onClose={() => setEditingIncome(null)}
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
    backgroundColor: '#064E3B',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#065F46',
  },
  summaryIcon: {
    backgroundColor: '#022C22',
    borderRadius: 12,
    padding: 10,
  },
  summaryLabel: {
    color: '#6EE7B7',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryValue: {
    color: '#10B981',
    fontSize: 26,
    fontWeight: '900',
    marginTop: 2,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 170,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
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
  itemFreq: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '500',
  },
  itemRight: {
    alignItems: 'flex-end',
    gap: 6,
    flexShrink: 1,
  },
  itemAmount: {
    color: '#10B981',
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
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    backgroundColor: '#10B981',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
});
