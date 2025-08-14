// components/BreathingPhase.js
import React, { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { phaseStyles } from './styles/phaseStyles';
import { getSoundFns } from '../hooks/soundRegistry';

export default function BreathingPhase({
  duration,           // total seconds for this phase
  inhaleDuration = 4, // customize via PhaseManager/config
  exhaleDuration = 4,
  onComplete,
}) {
  const [t, setT] = useState(0);
  const prevPhase = useRef('inhale');

  // Pull the registered play functions (set by HomeScreen)
  const { playInhale, playExhale } = getSoundFns();

  // Reset on duration change
  useEffect(() => setT(0), [duration]);

  // Main 1s loop
  useEffect(() => {
    if (t >= duration) {
      onComplete?.();
      return;
    }
    const id = setInterval(() => setT((p) => p + 1), 220);
    return () => clearInterval(id);
  }, [t, duration, onComplete]);

  // Compute current sub-phase
  const cycle = inhaleDuration + exhaleDuration;
  const tInCycle = t % cycle;
  const isInhale = tInCycle < inhaleDuration;
  const breathCount = Math.floor(t / cycle) + 1;

  // Fire SFX on boundaries (including the very first tick)
  useEffect(() => {
    const now = isInhale ? 'inhale' : 'exhale';

    // Safety: if someone navigated here before Home finished, bail gracefully
    if (!playInhale || !playExhale) return;

    if (t === 0 || prevPhase.current !== now) {
      if (now === 'inhale') playInhale();
      else playExhale();
      prevPhase.current = now;
    }
  }, [isInhale, t, playInhale, playExhale]);

  return (
    <View>
      <Text style={phaseStyles.title}>{isInhale ? 'In' : 'Out'}</Text>
      <Text style={phaseStyles.subtext}>Breaths: {breathCount}</Text>
    </View>
  );
}
