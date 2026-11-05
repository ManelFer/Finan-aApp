import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EmergencyFundCalculator } from '../components/EmergencyFundCalculator';
import { CompoundInterestCalculator } from '../components/CompoundInterestCalculator';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';

const TIPS = [
  {
    icon: 'shield-checkmark' as const,
    color: '#14B8A6',
    title: 'Reserva de Emergência',
    text: 'Mantenha de 3 a 6 meses de despesas em uma aplicação de alta liquidez (como Tesouro Selic ou CDB com liquidez diária).',
  },
  {
    icon: 'trending-up' as const,
    color: '#10B981',
    title: 'Regra dos 50/30/20',
    text: '50% da renda para necessidades, 30% para desejos e 20% para poupança e investimentos.',
  },
  {
    icon: 'card' as const,
    color: '#EF4444',
    title: 'Cartão de Crédito',
    text: 'Evite pagar apenas o mínimo — os juros rotativos do cartão podem superar 400% ao ano.',
  },
  {
    icon: 'repeat' as const,
    color: '#818CF8',
    title: 'Aportes Regulares',
    text: 'Aportes mensais consistentes, mesmo que pequenos, têm mais impacto do que grandes aportes esporádicos.',
  },
];

export const ToolsScreen: React.FC = () => {
  const { horizontalPadding, maxContentWidth, contentWidth } = useResponsiveLayout();

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
      {/* Header */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Ferramentas Financeiras</Text>
        <Text style={styles.pageSubtitle}>Calcule e planeje seu futuro</Text>
      </View>

      {/* Emergency Fund Calculator */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="shield-checkmark" size={20} color="#14B8A6" />
          <Text style={styles.sectionTitle}>Reserva de Emergência</Text>
        </View>
        <EmergencyFundCalculator />
      </View>

      {/* Compound Interest Calculator */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="calculator" size={20} color="#818CF8" />
          <Text style={styles.sectionTitle}>Juros Compostos</Text>
        </View>
        <CompoundInterestCalculator />
      </View>

      {/* Tips */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="bulb" size={20} color="#F59E0B" />
          <Text style={styles.sectionTitle}>Dicas Financeiras</Text>
        </View>

        {TIPS.map((tip, idx) => (
          <View key={idx} style={styles.tipCard}>
            <View style={[styles.tipIcon, { backgroundColor: tip.color + '22' }]}>
              <Ionicons name={tip.icon} size={20} color={tip.color} />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipText}>{tip.text}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: 40 }} />
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
  },
  pageHeader: {
    marginBottom: 20,
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '700',
  },
  tipCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  tipText: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 18,
  },
});
