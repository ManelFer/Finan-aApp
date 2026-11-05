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
import { DebtCategory } from '../types/finance';
import { useFinance } from '../context/FinanceContext';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const CATEGORIES: { label: string; value: DebtCategory }[] = [
  { label: 'Cartão de Crédito', value: 'cartao' },
  { label: 'Financiamento', value: 'financiamento' },
  { label: 'Empréstimo', value: 'emprestimo' },
  { label: 'Contas Fixas', value: 'contas_fixas' },
  { label: 'Outros', value: 'outros' },
];

export const AddDebtModal: React.FC<Props> = ({ visible, onClose }) => {
  const { addDebt } = useFinance();
  const [title, setTitle] = useState('');
  const [installmentValue, setInstallmentValue] = useState('');
  const [totalInstallments, setTotalInstallments] = useState('1');
  const [paidInstallments, setPaidInstallments] = useState('0');
  const [dueDay, setDueDay] = useState('10');
  const [interestRate, setInterestRate] = useState('');
  const [category, setCategory] = useState<DebtCategory>('cartao');
  const [notes, setNotes] = useState('');

  const handleSave = async () => {
    const val = parseFloat(installmentValue.replace(',', '.'));
    const totInst = parseInt(totalInstallments, 10) || 1;
    const paidInst = parseInt(paidInstallments, 10) || 0;
    const dDay = parseInt(dueDay, 10) || 10;
    const rate = interestRate ? parseFloat(interestRate.replace(',', '.')) : undefined;

    if (!title.trim() || isNaN(val) || val <= 0) {
      alert('Por favor, informe a descrição e o valor da parcela.');
      return;
    }

    const calculatedTotal = val * totInst;

    await addDebt({
      title: title.trim(),
      installmentValue: val,
      totalAmount: calculatedTotal,
      totalInstallments: totInst,
      paidInstallments: paidInst,
      dueDay: dDay,
      interestRate: rate,
      category,
      isPaidThisMonth: false,
      notes: notes.trim() || undefined,
    });

    setTitle('');
    setInstallmentValue('');
    setTotalInstallments('1');
    setPaidInstallments('0');
    setInterestRate('');
    setNotes('');
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
            <Text style={styles.title}>Adicionar Dívida / Parcela</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Descrição da Dívida</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Fatura Nubank, Carro, Empréstimo"
              placeholderTextColor="#64748B"
              value={title}
              onChangeText={setTitle}
            />

            <View style={styles.row}>
              <View style={styles.flex1}>
                <Text style={styles.label}>Valor da Parcela (R$)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 350.00"
                  placeholderTextColor="#64748B"
                  keyboardType="decimal-pad"
                  value={installmentValue}
                  onChangeText={setInstallmentValue}
                />
              </View>

              <View style={styles.flex1}>
                <Text style={styles.label}>Dia Vencimento</Text>
                <TextInput
                  style={styles.input}
                  placeholder="10"
                  placeholderTextColor="#64748B"
                  keyboardType="number-pad"
                  value={dueDay}
                  onChangeText={setDueDay}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.flex1}>
                <Text style={styles.label}>Total de Parcelas</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1 (para fatura única)"
                  placeholderTextColor="#64748B"
                  keyboardType="number-pad"
                  value={totalInstallments}
                  onChangeText={setTotalInstallments}
                />
              </View>

              <View style={styles.flex1}>
                <Text style={styles.label}>Parcelas Já Pagas</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#64748B"
                  keyboardType="number-pad"
                  value={paidInstallments}
                  onChangeText={setPaidInstallments}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.flex1}>
                <Text style={styles.label}>Taxa de Juros (% a.m.) Opcional</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 1.5"
                  placeholderTextColor="#64748B"
                  keyboardType="decimal-pad"
                  value={interestRate}
                  onChangeText={setInterestRate}
                />
              </View>
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

            <Text style={styles.label}>Observações (Opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Ex: Tentar amortizar no final do ano..."
              placeholderTextColor="#64748B"
              multiline
              numberOfLines={2}
              value={notes}
              onChangeText={setNotes}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Ionicons name="add-circle" size={20} color="#FFFFFF" />
              <Text style={styles.saveBtnText}>Registrar Dívida</Text>
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
    maxHeight: '92%',
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
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
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  categoryCard: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryCardActive: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  categoryCardText: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '500',
  },
  categoryCardTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    marginBottom: 20,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
