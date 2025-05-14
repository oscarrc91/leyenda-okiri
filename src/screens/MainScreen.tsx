import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DrawerActions, useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

const tabIcons: Record<string, any> = {
  Equipo:     require('../assets/icons/tab-equip.png'),
  Inventario: require('../assets/icons/tab-inventory.png'),
  Personaje:  require('../assets/icons/tab-character.png'),
  Combate:    require('../assets/icons/tab-combat.png'),
  Notas:      require('../assets/icons/tab-notes.png'),
};

// Empty placeholder screens for each tab
function EquipScreen()    { return <View style={styles.placeholder} />; }
function InventoryScreen(){ return <View style={styles.placeholder} />; }
function CharacterScreen() { return <View style={styles.placeholder} />; }
function CombatScreen()   { return <View style={styles.placeholder} />; }
function NotesScreen()     { return <View style={styles.placeholder} />; }

export default function MainScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const navigation = useNavigation();

  // Si has pasado el email como parámetro de navegación:
  const email = (route.params as any)?.email as string | undefined;
  const initial = email ? email.charAt(0).toUpperCase() : null;


  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      {/* Header simplificado respetando safe area */}
      <View style={[styles.header, { alignSelf: 'flex-start' }]}>
        {initial
          // Si tenemos initial, mostramos solo el avatar a la izquierda
          ? (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
          )
          // Si no, mostramos solo el icono de menú
          : (
            <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
              <Icon name="menu" size={28} style={styles.menuIcon} />
            </TouchableOpacity>
          )
        }
      </View>

      {/* Tabs */}
      <View style={{ flex: 1 }}>
        <Tab.Navigator
            initialRouteName="Personaje"
            screenOptions={({ route }) => ({
            headerShown: false,
            tabBarShowLabel: true,
            tabBarStyle: styles.tabBar,
            tabBarLabelStyle: styles.tabLabel,
            tabBarActiveTintColor: '#c20e0d',
            tabBarInactiveTintColor: '#899aa4',
            tabBarIcon: ({ focused }) => (
                <Image
                    source={ tabIcons[route.name] }
                    style={[
                    styles.tabIcon,
                    { tintColor: focused ? '#c20e0d' : '#899aa4' }
                    ]}
                    resizeMode="contain"
                />
                )
            })}
        >
            
            <Tab.Screen name="Equipo"     component={EquipScreen} />
            <Tab.Screen name="Inventario" component={InventoryScreen} />
            <Tab.Screen name="Personaje"  component={CharacterScreen} />
            <Tab.Screen name="Combate"    component={CombatScreen} />
            <Tab.Screen name="Notas"      component={NotesScreen} />
        </Tab.Navigator>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121619',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    alignSelf: 'flex-start',
  },
  menuIcon: {
    color: "#FFF",
    marginLeft: 16,
    marginTop: 16,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 20,
    backgroundColor: '#c20e0d',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
    marginTop: 16,
  },
  avatarText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 19,
    lineHeight: 18,
  },
  placeholder: {
    flex: 1,
    backgroundColor: '#121619',
  },
  tabBar: {
    backgroundColor: '#121619',
    borderTopWidth: 0,
    elevation: 8,
    height: 75,
    paddingBottom: 0,
  },
  tabIcon: {
    width: 45,
    height: 45,
    marginTop:15
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 12,
  },
});
