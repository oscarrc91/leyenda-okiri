import {
    createDrawerNavigator,
    DrawerContentComponentProps,
    DrawerContentScrollView
} from '@react-navigation/drawer';
import React from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { default as MainScreen } from '../screens/MainScreen';
// … importa el resto de pantallas del drawer

const { width } = Dimensions.get('window');
const Drawer = createDrawerNavigator();

// Este es tu contenido personalizado del drawer
function CustomDrawerContent(props: DrawerContentComponentProps) {
  // --- aquí saca tus datos reales de nivel y exp ---
  const level = 1;
  const exp = 250;
  const nextLevelExp = 1000;
  const progress = Math.min(exp / nextLevelExp, 1);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* ——— HEADER —— */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
          <Icon name="arrow-back-ios" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}> NIVEL {level} | {exp} EXP </Text>
        {/* Barra de progreso */}
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      {/* ——— Ítems de menú —— */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollArea}
      >
        {[
          { label: 'Nuevo personaje', route: 'Nuevo' },
          { label: 'Ajustes',          route: 'Ajustes' },
          { label: 'Soporte',         route: 'Soporte' },
          { label: 'Política de privacidad', route: 'Privacidad' },
          { label: 'Términos de uso', route: 'Terminos' },
          { label: 'Cerrar sesión',   action: () => {
              // tu lógica de logout:
              props.navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }]
              });
            }
          },
        ].map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.itemRow}
            onPress={() => {
              if (item.route) props.navigation.navigate(item.route);
              else if (item.action) item.action();
            }}
          >
            <Text style={styles.bullet}>◊</Text>
            <Text style={styles.itemLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </DrawerContentScrollView>
    </SafeAreaView>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        // fondo tipo pergamino:
        drawerStyle: { backgroundColor: '#F2E7D5', width: width * 0.75 }
      }}
    >
      <Drawer.Screen name="Home"    component={MainScreen} />
      {/* … el resto de pantallas */}
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#293743'
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#C8B29B'
  },
  headerText: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF'
  },
  progressBg: {
    marginTop: 8,
    width: '100%',
    height: 6,
    backgroundColor: '#FFF',
    borderRadius: 3,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#c20e0d'
  },
  scrollArea: {
    paddingTop: 24,
    paddingHorizontal: 16
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12
  },
  bullet: {
    marginRight: 12,
    fontSize: 12,
    color: '#FFF'
  },
  itemLabel: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600'
  }
});
