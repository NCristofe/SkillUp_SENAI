import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AppNavigator from './src/navigation/AppNavigator';
import { initDatabase } from './src/services/database';
import { colors } from './src/styles/colors';

// Tema React Native Paper com as cores SENAI
const senaiTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    surface: colors.surface,
    error: colors.error,
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
  },
};

export default function App() {
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState(null);

  useEffect(() => {
    initDatabase()
      .then(() => setDbReady(true))
      .catch((err) => {
        console.error('Erro ao inicializar banco:', err);
        setDbError(err.message ?? 'Erro desconhecido');
      });
  }, []);

  if (dbError) {
    return (
      <View style={styles.errorScreen}>
        <Text style={styles.errorTitle}>Erro de inicialização</Text>
        <Text style={styles.errorMsg}>{dbError}</Text>
      </View>
    );
  }

  if (!dbReady) {
    return (
      <View style={styles.splashScreen}>
        <Text style={styles.splashTitle}>SENAI</Text>
        <Text style={styles.splashSub}>Suíço-Brasileira</Text>
        <ActivityIndicator
          size="large"
          color="rgba(255,255,255,0.8)"
          style={styles.splashSpinner}
        />
        <Text style={styles.splashLoading}>Carregando cursos...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={senaiTheme}>
        <StatusBar style="light" backgroundColor={colors.primary} />
        <AppNavigator />
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  // Splash / loading
  splashScreen: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashTitle: {
    fontSize: 52,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 4,
  },
  splashSub: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '300',
    letterSpacing: 2,
    marginTop: 4,
  },
  splashSpinner: { marginTop: 48 },
  splashLoading: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 12,
  },

  // Erro
  errorScreen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.error,
    marginBottom: 12,
  },
  errorMsg: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
