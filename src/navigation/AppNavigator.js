import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import AboutScreen from '../screens/AboutScreen';
import ContactScreen from '../screens/ContactScreen';
import { colors } from '../styles/colors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ── Stack interno da aba Home ─────────────────────────────────────────────────

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen
        name="CourseDetail"
        component={CourseDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// ── Ícone da aba com badge opcional ──────────────────────────────────────────

function TabIcon({ name, color, size, badge }) {
  return (
    <View>
      <MaterialCommunityIcons name={name} size={size} color={color} />
      {badge ? (
        <View style={tabStyles.badge}>
          <Text style={tabStyles.badgeText}>{badge}</Text>
        </View>
      ) : null}
    </View>
  );
}

const tabStyles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: colors.primary,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '700' },
});

// ── Navegador principal (Bottom Tabs) ─────────────────────────────────────────

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopWidth: 1,
            borderTopColor: colors.divider,
            height: 62,
            paddingBottom: 8,
            paddingTop: 6,
            elevation: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen
          name="Cursos"
          component={HomeStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <TabIcon name="book-open-variant" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Sobre"
          component={AboutScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <TabIcon name="information-outline" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Contato"
          component={ContactScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <TabIcon name="email-outline" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
