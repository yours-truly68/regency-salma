import React, { useRef } from 'react';
import { Pressable, Animated, PressableProps, StyleProp, ViewStyle, GestureResponderEvent } from 'react-native';

interface PremiumPressableProps extends PressableProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle> | ((state: { pressed: boolean }) => StyleProp<ViewStyle>);
  scaleTo?: number;
  activeOpacity?: number;
  pressTranslateY?: number;
}

export function PremiumPressable({ children, style, scaleTo = 0.98, activeOpacity = 0.8, pressTranslateY = 0, onPressIn, onPressOut, ...props }: PremiumPressableProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const handlePressIn = (e: GestureResponderEvent) => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: scaleTo,
        useNativeDriver: true,
        speed: 40,
        bounciness: 0,
      }),
      Animated.spring(translateY, {
        toValue: pressTranslateY,
        useNativeDriver: true,
        speed: 40,
        bounciness: 0,
      }),
    ]).start();
    if (onPressIn) onPressIn(e);
  };

  const handlePressOut = (e: GestureResponderEvent) => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();
    if (onPressOut) onPressOut(e);
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...props}
    >
      {({ pressed }) => (
        <Animated.View style={[
          typeof style === 'function' ? style({ pressed }) : style,
          { transform: [{ scale }, { translateY }], opacity: pressed ? activeOpacity : 1 }
        ]}>
          {typeof children === 'function' ? (children as any)({ pressed }) : children}
        </Animated.View>
      )}
    </Pressable>
  );
}
