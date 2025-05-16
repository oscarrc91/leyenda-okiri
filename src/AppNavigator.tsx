import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import DrawerNavigator from './navigation/DrawerNavigator';
import LoginScreen from './screens/LoginScreen';
import NewCharacterScreen from './screens/NewCharacterScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import SplashScreen from './screens/SplashScreen';

export type RootStackParamList = {
  Splash: undefined;
  Login: { openEmailModal?: boolean; email?: string };
  ResetPassword: undefined;
  Main: { email?: string };
  NewCharacter: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="Main" component={DrawerNavigator} />
      <Stack.Screen name="NewCharacter" component={NewCharacterScreen} />
    </Stack.Navigator>
  );
}