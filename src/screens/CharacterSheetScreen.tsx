import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

export default function CharacterSheetScreen() {
  return (
    <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        {/* Top bar */}
        <View style={styles.topBar}>
            <View style={{ flex: 1 }} />
            <TouchableOpacity onPress={() => {/* open drawer/options */}}>
            <Icon name="menu" size={28} color="#FFF" />
            </TouchableOpacity>
        </View>

        {/* Tabs */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121619',
  },
  topBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
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
