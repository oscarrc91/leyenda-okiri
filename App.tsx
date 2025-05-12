import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import AppNavigator from './src/AppNavigator';
import { BannerProvider, useBanner } from './src/contexts/BannerContext';
import { initDatabase } from './src/services/database';

function DebugStarter() {
  const show = useBanner();
  useEffect(() => {
    show({
      icon: require('./src/assets/images/pass_icon.png'),
      children: 'Banner de prueba al arrancar',
      compact: true,
      onPress: () => (true),
    });
  }, []);
  return null;
}

export default function App() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <BannerProvider>
      {/* Este View es EL ÚNICO que ocupa pantalla completa */}
      <View style={{ flex: 1 }}>
        {/* Se dispara tu banner de prueba aquí */}
        <DebugStarter />

        {/* Tu navegación como siempre */}
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </View>
    </BannerProvider>
  );
}