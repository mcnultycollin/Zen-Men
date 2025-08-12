// components/HoldPhase.js
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { phaseStyles } from './styles/phaseStyles';

export default function GetReady({ duration, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration); // reset on mount or duration change
  }, [duration]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete(); // ✅ trigger when finished, NOT during render
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <View>
      <Text style={phaseStyles.title}>Get Ready</Text>
      <Text style={phaseStyles.timer}>{String(timeLeft).padStart(2, '0')}</Text>
    </View>
  );
}
