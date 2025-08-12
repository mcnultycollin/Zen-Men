import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { phaseStyles } from './styles/phaseStyles';

export default function HoldPhase({ duration, onComplete }) {
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

  return (
    <View>
      <Text style={phaseStyles.title}>Hold Your Breath</Text>
      <Text style={phaseStyles.timer}>{String(timeHeld).padStart(2, '0')}</Text>
    </View>
  );
}
