import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '../utils/formatters';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';

export const CompoundInterestCalculator: React.FC = () => {
  const { isCompact } = useResponsiveLayout();
  const [initialAmount, setInitialAmount] = useState('1000');
  const [monthlyContribution, setMonthlyContribution] = useState('500');
  const [annualRate, setAnnualRate] = useState('11.5');
  const [years, setYears] = useState('5');

  const p = parseFloat(initialAmount) || 0;
  const pmt = parseFloat(monthlyContribution) || 0;
  const rAnnual = parseFloat(annualRate) || 0;
  const numYears = parseFloat(years) || 0;

  // Convert annual rate to monthly compound rate: i_m = (1 + i_a)^(1/12) - 1
  const monthlyRate = rAnnual > 0 ? Math.pow(1 + rAnnual / 100, 1 / 12) - 1 : 0;
  const totalMonths = Math.round(numYears * 12);

  let futureValue = p;
  let totalInvested = p;

  if (totalMonths > 0) {
    if (monthlyRate > 0) {
      futureValue =
        p * Math.pow(1 + monthlyRate, totalMonths) +
        pmt * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    } else {
      futureValue = p + pmt * totalMonths;
    }
    totalInvested = p + pmt * totalMonths;
  }

  const totalInterest = Math.max(0, futureValue - totalInvested);
  const interestPercentage = futureValue > 0 ? (totalInterest / futureValue) * 100 : 0;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name="trending-up" size={20} color="#10B981" />
        </View>
        <Text style={styles.title}>Simulador de Juros Compostos</Text>
      </View>
      <Text style={styles.subtitle}>
        Veja a força do tempo e dos aportes consistentes multiplicando seu dinheiro.
      </Text>

      <View style={[styles.grid, isCompact && styles.gridCompact]}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Aporte Inicial (R$)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={initialAmount}
            onChangeText={setInitialAmount}
            placeholder="0"
            placeholderTextColor="#64748B"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Aporte Mensal (R$)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={monthlyContribution}
            onChangeText={setMonthlyContribution}
            placeholder="0"
            placeholderTextColor="#64748B"
          />
        </View>
      </View>

      <View style={[styles.grid, isCompact && styles.gridCompact]}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Taxa Anual (% a.a.)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={annualRate}
            onChangeText={setAnnualRate}
            placeholder="Ex: 11.5"
            placeholderTextColor="#64748B"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Prazo (Anos)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={years}
            onChangeText={setYears}
            placeholder="5"
            placeholderTextColor="#64748B"
          />
        </View>
      </View>

      {/* Quick period presets */}
      <View style={styles.presetRow}>
        {[1, 3, 5, 10, 20].map((y) => (
          <TouchableOpacity
            key={y}
            style={[styles.presetButton, years === y.toString() && styles.presetButtonActive]}
            onPress={() => setYears(y.toString())}
          >
            <Text
              style={[
                styles.presetButtonText,
                years === y.toString() && styles.presetButtonTextActive,
              ]}
            >
              {y} {y === 1 ? 'ano' : 'anos'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Result box */}
      <View style={styles.resultBox}>
        <Text style={styles.resultLabel}>Total Acumulado Estimado</Text>
        <Text style={styles.resultValue}>{formatCurrency(futureValue)}</Text>

        <View style={styles.barContainer}>
          <View
            style={[
              styles.barInvested,
              { width: `${Math.max(5, 100 - interestPercentage)}%` },
            ]}
          />
          <View
            style={[
              styles.barInterest,
              { width: `${Math.min(95, interestPercentage)}%` },
            ]}
          />
        </View>

        <View style={styles.breakdownRow}>
          <View style={styles.breakdownItem}>
            <View style={[styles.dot, { backgroundColor: '#3B82F6' }]} />
            <Text style={styles.breakdownText}>
              Aportado: <Text style={styles.breakdownHighlight}>{formatCurrency(totalInvested)}</Text>
            </Text>
          </View>
          <View style={styles.breakdownItem}>
            <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.breakdownText}>
              Em Juros: <Text style={styles.breakdownHighlightGreen}>+{formatCurrency(totalInterest)}</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#064E3B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '700',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 13,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  gridCompact: {
    flexDirection: 'column',
  },
  inputGroup: {
    flex: 1,
  },
  label: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    fontWeight: '600',
  },
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 4,
  },
  presetButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
  },
  presetButtonActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  presetButtonText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  presetButtonTextActive: {
    color: '#0F172A',
    fontWeight: '700',
  },
  resultBox: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  resultLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resultValue: {
    color: '#10B981',
    fontSize: 26,
    fontWeight: '800',
    marginVertical: 4,
  },
  barContainer: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
    marginVertical: 12,
  },
  barInvested: {
    height: '100%',
    backgroundColor: '#3B82F6',
  },
  barInterest: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  breakdownText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  breakdownHighlight: {
    color: '#F8FAFC',
    fontWeight: '600',
  },
  breakdownHighlightGreen: {
    color: '#10B981',
    fontWeight: '700',
  },
});
