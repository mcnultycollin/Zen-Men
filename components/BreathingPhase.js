import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { phaseStyles } from './styles/phaseStyles';

export default function BreathingPhase({ duration, onComplete }) {
  const [timeHeld, setTimeHeld] = useState(0);

  useEffect(() => {
    setTimeHeld(0); // reset on mount
  }, [duration]);

  useEffect(() => {
    if (timeHeld >= duration) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeHeld((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeHeld]);

  const isInhale = timeHeld % 2 === 0;
  const breathCount = Math.floor(timeHeld / 2) + 1;

  return (
    <View>
      <Text style={phaseStyles.title}>{isInhale ? 'In' : 'Out'}</Text>
      <Text style={phaseStyles.subtext}>Breaths: {breathCount}</Text>
    </View>
  );
}
