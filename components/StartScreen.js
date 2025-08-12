// components/StartScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';

export default function StartScreen({ onStart }) {
  // Pulse for the glow + scale
  const pulse = useSharedValue(0);
  // Fade the whole screen out when starting
  const fade = useSharedValue(1);

  useEffect(() => {
    // loop 0↔1 for pulsing effect
    pulse.value = withRepeat(withTiming(1, { duration: 1200 }), -1, true);
  }, [pulse]);

  const haloStyle = useAnimatedStyle(() => {
    // 0..1 → small..big & faint..bright
    const scale = 1 + 0.22 * pulse.value;
    const opacity = 0.35 + 0.35 * pulse.value;
    return { transform: [{ scale }], opacity };
  });

  const buttonStyle = useAnimatedStyle(() => {
    const scale = 1 + 0.04 * pulse.value; // subtle breathing of the button itself
    return { transform: [{ scale }] };
  });

  const screenFadeStyle = useAnimatedStyle(() => ({ opacity: fade.value }));

  const handlePress = () => {
    // press feedback: quick shrink, then expand while fading screen
    // keep presses idempotent by stopping pulse once we start
    pulse.value = 0;
    // button feedback
    // (visual change mostly from halo/buttonStyle; no need to mutate here)
    // fade out whole overlay and call onStart at the end
    fade.value = withSequence(
      withTiming(0.92, { duration: 80 }),
      withTiming(0, { duration: 240 })
    );
    // call JS after fade completes (~320ms)
    setTimeout(() => onStart?.(), 320);
  };

  return (
    <Animated.View style={[styles.wrap, screenFadeStyle]} pointerEvents="auto">
      <View style={styles.center}>
        {/* Glowing halo behind the button (animated) */}
        <Animated.View style={[styles.halo, haloStyle]} />

        {/* The button itself */}
        <Animated.View style={[styles.btnOuter, buttonStyle]}>
          <Pressable onPress={handlePress} style={styles.btn} hitSlop={12}>
            <Text style={styles.btnText}>Start</Text>
          </Pressable>
        </Animated.View>

        {/* Optional subtitle/instructions */}
        <Text style={styles.subtle}>Tap to begin</Text>
      </View>
    </Animated.View>
  );
}

const BTN_DIAMETER = 140;
const HALO_DIAMETER = 280;

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  // Soft glow
  halo: {
    position: 'absolute',
    width: HALO_DIAMETER,
    height: HALO_DIAMETER,
    borderRadius: HALO_DIAMETER / 2,
    backgroundColor: 'rgba(255,255,255,0.5)',
    // extra bloom on iOS
    shadowColor: '#FFFFFF',
    shadowOpacity: 0.9,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 0 },
  },
  btnOuter: {
    borderRadius: BTN_DIAMETER / 2,
  },
  btn: {
    width: BTN_DIAMETER,
    height: BTN_DIAMETER,
    borderRadius: BTN_DIAMETER / 2,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    // subtle inner shadow feel (Android gets flat white circle)
    shadowColor: '#FFFFFF',
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
  },
  btnText: {
    color: 'black',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  subtle: { color: 'rgba(255,255,255,0.85)', marginTop: 8 },
});