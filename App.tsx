import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { BackHandler, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }} edges={['top', 'bottom']}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="black"
          translucent={false}
        />
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaView>
    </BannerProvider>
  );
}