import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { BackHandler } from 'react-native';
import AppNavigator from './src/AppNavigator';
import { BannerProvider } from './src/contexts/BannerContext';
import { initDatabase } from './src/services/database';

export default function App() {
  useEffect(() => {
    initDatabase();

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        return true;
      }
    );
    return () => subscription.remove();
  }, []);

  return (
    <BannerProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </BannerProvider>
  );
}