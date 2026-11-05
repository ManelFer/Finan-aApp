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
import { InvestmentCategory } from '../types/finance';
import { useFinance } from '../context/FinanceContext';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const CATEGORIES: { label: string; value: InvestmentCategory }[] = [
  { label: 'Renda Fixa / CDB', value: 'renda_fixa' },
  { label: 'Tesouro Direto', value: 'tesouro_direto' },
  { label: 'Reserva Emergência', value: 'reserva_emergencia' },
  { label: 'FIIs (Imobiliários)', value: 'fiis' },
  { label: 'Ações (Bolsa)', value: 'acoes' },
  { label: 'Cripto', value: 'cripto' },
  { label: 'Outros', value: 'outros' },
];

export const AddInvestmentModal: React.FC<Props> = ({ visible, onClose }) => {
  const { addInvestment } = useFinance();
  const [name, setName] = useState('');
  const [ticker, setTicker] = useState('');
  const [category, setCategory] = useState<InvestmentCategory>('renda_fixa');
  const [investedAmount, setInvestedAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [expectedAnnualYield, setExpectedAnnualYield] = useState('');
  const [broker, setBroker] = useState('');

  const handleSave = async () => {
    const invested = parseFloat(investedAmount.replace(',', '.'));
    const current = currentAmount ? parseFloat(currentAmount.replace(',', '.')) : invested;

    if (!name.trim() || isNaN(invested) || invested < 0) {
      alert('Por favor, informe o nome do ativo e o valor investido.');
      return;
    }

    const target = targetAmount ? parseFloat(targetAmount.replace(',', '.')) : undefined;
    const monthly = monthlyContribution ? parseFloat(monthlyContribution.replace(',', '.')) : undefined;
    const yieldRate = expectedAnnualYield ? parseFloat(expectedAnnualYield.replace(',', '.')) : undefined;

    await addInvestment({
      name: name.trim(),
      ticker: ticker.trim().toUpperCase() || undefined,
      category,
      investedAmount: invested,
      currentAmount: isNaN(current) ? invested : current,
      targetAmount: target,
      monthlyContribution: monthly,
      expectedAnnualYield: yieldRate,
      broker: broker.trim() || undefined,
    });

    setName('');
    setTicker('');
    setInvestedAmount('');
    setCurrentAmount('');
    setTargetAmount('');
    setMonthlyContribution('');
    setExpectedAnnualYield('');
    setBroker('');
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
            <Text style={styles.title}>Novo Investimento</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Nome do Ativo / Aplicação</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: CDB 110% CDI, Tesouro Selic 2029, MXRF11"
              placeholderTextColor="#64748B"
              value={name}
              onChangeText={setName}
            />

            <View style={styles.row}>
              <View style={styles.flex1}>
                <Text style={styles.label}>Código/Ticker (Opcional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: PETR4, MXRF11"
                  placeholderTextColor="#64748B"
                  autoCapitalize="characters"
                  value={ticker}
                  onChangeText={setTicker}
                />
              </View>

              <View style={styles.flex1}>
                <Text style={styles.label}>Corretora / Banco</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Nubank, XP, Inter"
                  placeholderTextColor="#64748B"
                  value={broker}
                  onChangeText={setBroker}
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

            <View style={styles.row}>
              <View style={styles.flex1}>
                <Text style={styles.label}>Total Investido (R$)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 5000.00"
                  placeholderTextColor="#64748B"
                  keyboardType="decimal-pad"
                  value={investedAmount}
                  onChangeText={setInvestedAmount}
                />
              </View>

              <View style={styles.flex1}>
                <Text style={styles.label}>Saldo Atual (R$)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Se diferente do aportado"
                  placeholderTextColor="#64748B"
                  keyboardType="decimal-pad"
                  value={currentAmount}
                  onChangeText={setCurrentAmount}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.flex1}>
                <Text style={styles.label}>Rendimento Estimado (% a.a.)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 11.75"
                  placeholderTextColor="#64748B"
                  keyboardType="decimal-pad"
                  value={expectedAnnualYield}
                  onChangeText={setExpectedAnnualYield}
                />
              </View>

              <View style={styles.flex1}>
                <Text style={styles.label}>Aporte Mensal Pretendido</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 300.00"
                  placeholderTextColor="#64748B"
                  keyboardType="decimal-pad"
                  value={monthlyContribution}
                  onChangeText={setMonthlyContribution}
                />
              </View>
            </View>

            <Text style={styles.label}>Meta de Valor Alvo (R$ Opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 20000.00"
              placeholderTextColor="#64748B"
              keyboardType="decimal-pad"
              value={targetAmount}
              onChangeText={setTargetAmount}
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Ionicons name="sparkles" size={20} color="#FFFFFF" />
              <Text style={styles.saveBtnText}>Adicionar à Carteira</Text>
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
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
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
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
    backgroundColor: '#6366F1',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 18,
    marginBottom: 20,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
