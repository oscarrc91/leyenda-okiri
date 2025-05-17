import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export type TopBannerProps = {
  icon?: ImageSourcePropType;
  children: React.ReactNode;
  onPress?: () => void;
};

export default function TopBanner({ icon, children, onPress }: TopBannerProps) {
  const Container: any = onPress ? TouchableOpacity : View;
  return (
    <Container style={styles.banner} onPress={onPress} activeOpacity={0.8}>
      {icon ? <Image source={icon} style={styles.icon} /> : null}
      <Text style={styles.text}>{children}</Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 40,
    right: 0,
    maxWidth: '75%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingLeft: 16,
    paddingRight: 20,
    zIndex: 1000,
  },
  icon: {
    width: 25,
    height: 25,
    marginRight: 8,
    tintColor: '#fff',
    resizeMode: 'contain',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  textBold: { fontWeight: 'bold' },
  textItalic: { fontStyle: 'italic' },
});
