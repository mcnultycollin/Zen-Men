import { Text } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { phaseStyles } from './styles/phaseStyles';

export default function CountdownPhase({ isPlaying, duration, onComplete, formatTime }) {
  return (
    <CountdownCircleTimer
      isPlaying={isPlaying}
      duration={duration}
      colors={['#004777', '#F7B801', '#A30000', '#A30000']}
      colorsTime={[7, 5, 2, 0]}
      onComplete={() => {
        onComplete();
        return { shouldRepeat: false };
      }}
    >
      {({ remainingTime }) => (
        <Text style={phaseStyles.title}>{formatTime(remainingTime)}</Text>
      )}
    </CountdownCircleTimer>
  );
}

