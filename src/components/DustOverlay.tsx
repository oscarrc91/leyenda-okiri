import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');
const TOTAL_DISTANCE = height + 20; // de -10 a height+10
const NUM_PARTICLES = 40;

type Particle = {
  x0: number;
  translateY: Animated.Value;
  slope: number;
  scale: number;
  opacity: number;
  duration: number;
};

export default function DustOverlay() {
  // 1) Crear partículas con POSITION aleatorio
  const particles = useRef<Particle[]>(
    Array.from({ length: NUM_PARTICLES }).map(() => {
      const duration = 20000 + Math.random() * 8000; // 20–28s
      const startY = Math.random() * TOTAL_DISTANCE - 10;  // [-10, height+10]
      return {
        x0: Math.random() * width,
        translateY: new Animated.Value(startY),
        slope: (Math.random() * 0.6) - 0.3,
        scale: 0.2 + Math.random() * 0.5,
        opacity: 0.05 + Math.random() * 0.15,
        duration,
      };
    })
  ).current;

  useEffect(() => {
    particles.forEach(p => {
      const animateCycle = (initialY: number, duration: number) => {
        // 2) Ajustar duración al primer tramo
        const remainingDistance = TOTAL_DISTANCE - (initialY + 10);
        const firstDuration = (remainingDistance / TOTAL_DISTANCE) * duration;

        // 3) Primera caída solo del tramo restante
        Animated.timing(p.translateY, {
          toValue: height + 10,
          duration: firstDuration,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
            // 4) Ciclos subsecuentes con duración plena
            Animated.loop(
              Animated.sequence([
                Animated.timing(p.translateY, {
                  toValue: height + 10,
                  duration: duration,
                  useNativeDriver: true,
                }),
                Animated.timing(p.translateY, {
                  toValue: -10,
                  duration: 0,
                  useNativeDriver: true,
                }),
              ])
            ).start();
          }
        });
      };

      // Lanzamos la animación con la Y y duración iniciales
      animateCycle((p.translateY as any)._value, p.duration);
    });
  }, []);

  return (
    <View style={StyleSheet.absoluteFillObject}>
      {particles.map((p, i) => {
        // X = x0 + slope * currentY
        const translateX = p.translateY.interpolate({
          inputRange: [-10, height + 10],
          outputRange: [p.x0, p.x0 + TOTAL_DISTANCE * p.slope],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                opacity: p.opacity,
                transform: [
                  { translateX },
                  { translateY: p.translateY },
                  { scale: p.scale },
                ],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F0EBD8',
  },
});