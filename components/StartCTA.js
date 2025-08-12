// components/StartCTA.js
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';

// Tweak sizes here
const BTN = 140;          // inner button diameter
const HALO = 280;         // outer glow diameter

export default function StartCTA({ onStart }) {
  const pulse = useSharedValue(0);
  const fade = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 1200 }), -1, true);
  }, [pulse]);

  const haloStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + 0.22 * pulse.value }],
    opacity: 0.35 + 0.35 * pulse.value,
  }));

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + 0.04 * pulse.value }],
  }));

  const wrapFade = useAnimatedStyle(() => ({ opacity: fade.value }));

  const handlePress = () => {
    fade.value = withTiming(0, { duration: 260 });
    setTimeout(() => onStart?.(), 260);
  };

  return (
    <Animated.View style={[styles.wrap, wrapFade]}>
      {/* Fixed square wrapper: centers halo & button together */}
      <View style={styles.concentricBox}>
        {/* Halo fills the box */}
        <Animated.View style={[styles.halo, haloStyle]} />
        {/* Button centered in the box */}
        <Animated.View style={[styles.btnOuter, btnStyle]}>
          <Pressable onPress={handlePress} style={styles.btn} hitSlop={12}>
            <Text style={styles.btnText}>Start</Text>
          </Pressable>
        </Animated.View>
              <Text style={styles.subtle}>Tap to begin</Text>

      </View>

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // This whole component will be centered by the parent (e.g., centerOverlay)
  wrap: { alignItems: 'center', justifyContent: 'center' },

  // Fixed square that both halo & button align to
  concentricBox: {
    width: HALO,
    height: HALO,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  // Halo fills the box; perfectly centered around button
  halo: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: HALO / 2,
    backgroundColor: 'rgba(255,255,255,0.5)',
    // iOS bloom
    shadowColor: '#FFFFFF',
    shadowOpacity: 0.9,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 0 },
  },

  // Button centered inside the box
  btnOuter: { borderRadius: BTN / 2 },
  btn: {
    width: BTN,
    height: BTN,
    borderRadius: BTN / 2,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFFFFF',
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
  },
  btnText: { color: 'black', fontSize: 24, fontWeight: '700', letterSpacing: 0.5 },

  subtle: { color: 'rgba(255,255,255,0.85)', marginTop: 10 },
});