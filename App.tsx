import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import AppNavigator from './src/AppNavigator';
import { BannerProvider } from './src/contexts/BannerContext';
import { initDatabase } from './src/services/database';

export default function App() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <BannerProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </BannerProvider>
  );
}