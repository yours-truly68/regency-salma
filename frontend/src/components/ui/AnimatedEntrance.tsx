import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

interface AnimatedEntranceProps {
  children: React.ReactNode;
  delay?: number;
  style?: ViewStyle | ViewStyle[];
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  duration?: number;
}

export function AnimatedEntrance({
  children,
  delay = 0,
  style,
  direction = 'up',
  distance = 20,
  duration = 400,
}: AnimatedEntranceProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(direction === 'none' ? 0 : distance)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.spring(translate, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [delay, duration, opacity, translate]);

  const transform = [];
  if (direction === 'up' || direction === 'down') {
    transform.push({ translateY: direction === 'up' ? translate : Animated.multiply(translate, -1) });
  } else if (direction === 'left' || direction === 'right') {
    transform.push({ translateX: direction === 'left' ? translate : Animated.multiply(translate, -1) });
  }

  return (
    <Animated.View style={[style, { opacity, transform }]}>
      {children}
    </Animated.View>
  );
}
