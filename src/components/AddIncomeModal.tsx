import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IncomeCategory } from '../types/finance';
import { useFinance } from '../context/FinanceContext';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const CATEGORIES: { label: string; value: IncomeCategory }[] = [
  { label: 'Salário Fixo', value: 'salario' },
  { label: 'Freelance / Extra', value: 'freelance' },
  { label: 'Rendimentos', value: 'investimentos' },
  { label: 'Benefícios', value: 'beneficios' },
  { label: 'Outros', value: 'outros' },
];

export const AddIncomeModal: React.FC<Props> = ({ visible, onClose }) => {
  const { addIncome } = useFinance();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState<'mensal' | 'quinzenal' | 'semanal' | 'unico'>('mensal');
  const [category, setCategory] = useState<IncomeCategory>('salario');
  const [receiveDay, setReceiveDay] = useState('5');

  const handleSave = async () => {
    const numAmount = parseFloat(amount.replace(',', '.'));
    if (!title.trim() || isNaN(numAmount) || numAmount <= 0) {
      alert('Por favor, informe uma descrição e um valor válido.');
      return;
    }

    await addIncome({
      title: title.trim(),
      amount: numAmount,
      frequency,
      category,
      receiveDay: parseInt(receiveDay, 10) || 5,
      date: new Date().toISOString(),
    });

    setTitle('');
    setAmount('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Adicionar Renda / Salário</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Salário Empresa, Bônus, Freelance"
              placeholderTextColor="#64748B"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Valor (R$)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 5000.00"
              placeholderTextColor="#64748B"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />

            <Text style={styles.label}>Dia do Recebimento (1 a 31)</Text>
            <TextInput
              style={styles.input}
              placeholder="5"
              placeholderTextColor="#64748B"
              keyboardType="number-pad"
              value={receiveDay}
              onChangeText={setReceiveDay}
            />

            <Text style={styles.label}>Frequência</Text>
            <View style={styles.rowSelector}>
              {(['mensal', 'quinzenal', 'semanal', 'unico'] as const).map((freq) => (
                <TouchableOpacity
                  key={freq}
                  style={[styles.chip, frequency === freq && styles.chipActive]}
                  onPress={() => setFrequency(freq)}
                >
                  <Text style={[styles.chipText, frequency === freq && styles.chipTextActive]}>
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Categoria</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  style={[styles.categoryCard, category === cat.value && styles.categoryCardActive]}
                  onPress={() => setCategory(cat.value)}
                >
                  <Text
                    style={[
                      styles.categoryCardText,
                      category === cat.value && styles.categoryCardTextActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Ionicons name="checkmark-circle" size={20} color="#0F172A" />
              <Text style={styles.saveBtnText}>Salvar Renda</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 32,
    borderWidth: 1,
    borderColor: '#334155',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    padding: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    color: '#F8FAFC',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#334155',
  },
  rowSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
  },
  chipActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  chipText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#0F172A',
    fontWeight: '700',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  categoryCard: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryCardActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  categoryCardText: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '500',
  },
  categoryCardTextActive: {
    color: '#0F172A',
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  saveBtnText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
});
