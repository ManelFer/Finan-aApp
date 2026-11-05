import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';

export const EmergencyFundCalculator: React.FC = () => {
  const { summary, emergencyGoal, updateEmergencyGoal } = useFinance();
  const [monthlyCost, setMonthlyCost] = useState(
    summary.totalMonthlyDebt > 0 ? (summary.totalMonthlyDebt * 1.5).toFixed(0) : '3000'
  );
  const [months, setMonths] = useState(6);

  const cost = parseFloat(monthlyCost) || 0;
  const calculatedTarget = cost * months;
  const currentReserve = summary.emergencyFundCurrent;
  const progressPercent =
    calculatedTarget > 0 ? Math.min(100, (currentReserve / calculatedTarget) * 100) : 0;

  const handleSaveGoal = async () => {
    await updateEmergencyGoal(calculatedTarget);
    Alert.alert('Meta Atualizada!', `Sua meta de Reserva de Emergência agora é ${formatCurrency(calculatedTarget)}.`);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name="shield-checkmark" size={20} color="#14B8A6" />
        </View>
        <Text style={styles.title}>Calculadora de Reserva de Emergência</Text>
      </View>
      <Text style={styles.subtitle}>
        A base de todo investidor inteligente para ter paz e segurança.
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Custo de Vida Mensal Essencial (R$)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={monthlyCost}
          onChangeText={setMonthlyCost}
          placeholder="Ex: 3000"
          placeholderTextColor="#64748B"
        />
      </View>

      <Text style={styles.label}>Meses de Cobertura:</Text>
      <View style={styles.presetRow}>
        {[
          { label: '3 Meses (Servidor)', value: 3 },
          { label: '6 Meses (CLT)', value: 6 },
          { label: '12 Meses (PJ/Autônomo)', value: 12 },
        ].map((item) => (
          <TouchableOpacity
            key={item.value}
            style={[styles.presetButton, months === item.value && styles.presetButtonActive]}
            onPress={() => setMonths(item.value)}
          >
            <Text
              style={[
                styles.presetButtonText,
                months === item.value && styles.presetButtonTextActive,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.resultBox}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.resultLabel}>Meta Recomendada</Text>
            <Text style={styles.resultValue}>{formatCurrency(calculatedTarget)}</Text>
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveGoal}>
            <Ionicons name="checkmark-circle-outline" size={16} color="#0F172A" />
            <Text style={styles.saveButtonText}>Definir Meta</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>
            Saldo Atual Guardado: <Text style={styles.whiteBold}>{formatCurrency(currentReserve)}</Text>
          </Text>
          <Text style={styles.footerPercent}>{progressPercent.toFixed(0)}% concluído</Text>
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
    backgroundColor: '#042F2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 13,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 12,
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
    flexDirection: 'column',
    gap: 8,
    marginBottom: 16,
  },
  presetButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
  },
  presetButtonActive: {
    backgroundColor: '#14B8A6',
    borderColor: '#14B8A6',
  },
  presetButtonText: {
    color: '#94A3B8',
    fontSize: 13,
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
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  resultValue: {
    color: '#14B8A6',
    fontSize: 22,
    fontWeight: '800',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#14B8A6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '700',
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 14,
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#14B8A6',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  whiteBold: {
    color: '#F8FAFC',
    fontWeight: '600',
  },
  footerPercent: {
    color: '#14B8A6',
    fontSize: 12,
    fontWeight: '700',
  },
});
