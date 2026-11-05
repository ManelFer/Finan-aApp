import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FinanceProvider, useFinance } from './src/context/FinanceContext';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { IncomesScreen } from './src/screens/IncomesScreen';
import { DebtsScreen } from './src/screens/DebtsScreen';
import { InvestmentsScreen } from './src/screens/InvestmentsScreen';
import { ToolsScreen } from './src/screens/ToolsScreen';

type TabName = 'dashboard' | 'incomes' | 'debts' | 'investments' | 'tools';

const TABS: { name: TabName; label: string; icon: string }[] = [
  { name: 'dashboard', label: 'Painel', icon: 'home' },
  { name: 'incomes', label: 'Rendas', icon: 'arrow-down-circle' },
  { name: 'debts', label: 'Dívidas', icon: 'arrow-up-circle' },
  { name: 'investments', label: 'Carteira', icon: 'trending-up' },
  { name: 'tools', label: 'Ferramentas', icon: 'calculator' },
];

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabName>('dashboard');
  const { isLoading, loadError, reloadData } = useFinance();
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Carregando seus dados...</Text>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Não foi possível carregar seus dados.</Text>
        <Text style={styles.loadingText}>{loadError}</Text>
        <TouchableOpacity onPress={() => void reloadData()} activeOpacity={0.7}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleNavigateTab = (tab: 'incomes' | 'debts' | 'investments' | 'tools') => {
    setActiveTab(tab);
  };

  return (
    <View style={styles.appContainer}>
      <View style={styles.screenContainer}>
        {activeTab === 'dashboard' && <DashboardScreen onNavigateTab={handleNavigateTab} />}
        {activeTab === 'incomes' && <IncomesScreen />}
        {activeTab === 'debts' && <DebtsScreen />}
        {activeTab === 'investments' && <InvestmentsScreen />}
        {activeTab === 'tools' && <ToolsScreen />}
      </View>

      {/* Tab Bar */}
      <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.name;
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tabItem}
              onPress={() => setActiveTab(tab.name)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={
                  isActive
                    ? (tab.icon as React.ComponentProps<typeof Ionicons>['name'])
                    : (`${tab.icon}-outline` as React.ComponentProps<typeof Ionicons>['name'])
                }
                size={22}
                color={isActive ? '#10B981' : '#64748B'}
              />
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar style="light" />
        <FinanceProvider>
          <AppContent />
        </FinanceProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  appContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    minWidth: 56,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
    flexShrink: 1,
  },
  tabLabelActive: {
    color: '#10B981',
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  retryText: {
    color: '#10B981',
    fontSize: 15,
    fontWeight: '700',
    padding: 12,
  },
});
