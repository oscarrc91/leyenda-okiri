import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

type Props = {
  label: string;
  icon: any;           // require(...) o URI
  onPress: () => void;
  style?: ViewStyle;
};

export default function SocialLoginButton({ label, icon, onPress, style }: Props) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Image source={icon} style={styles.icon} />
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 12,
    marginVertical: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});