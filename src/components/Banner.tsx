import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export type BannerProps = {
  id: string;
  icon?: any;
  children: React.ReactNode;
  onPress?: () => void;
  compact?: boolean;           // <— nuevo prop
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function Banner({ icon, children, onPress, compact }: BannerProps) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(opacity,    { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();

    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, { toValue: -100, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity,    { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  const bannerStyle = compact
    ? [styles.bannerCompact, { opacity, transform: [{ translateY }] }]
    : [styles.bannerFull,    { opacity, transform: [{ translateY }] }];

  const content = (
    <Animated.View style={bannerStyle}>
      {icon && <Image source={icon} style={styles.icon} />}
      <View style={styles.textContainer}>
        <Text style={styles.text}>{children}</Text>
      </View>
    </Animated.View>
  );

  return onPress
    ? <TouchableOpacity activeOpacity={0.8} onPress={onPress}>{content}</TouchableOpacity>
    : content;
}

const styles = StyleSheet.create({
  bannerFull: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    zIndex: 1000,
    ...Platform.select({ android: { elevation: 10 } }),
  },
  bannerCompact: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: SCREEN_WIDTH * 0.7,   // 70% ancho
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    zIndex: 1000,
    ...Platform.select({ android: { elevation: 10 } }),
  },
  icon: {
    width: 20, height: 20,
    marginRight: 8,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 18,
  },
});
