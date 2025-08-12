import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showStopwatch, setShowStopwatch] = useState(true);
  const [showTimer, setShowTimer] = useState(false);
  const [holdTimeLeft, setHoldTimeLeft] = useState(15); // for Hold phase
  const [showGetReady, setShowGetReady] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [roundCount, setRoundCount] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [showHold, setShowHold] = useState(false);

  const maxRounds = 2;              // Change as needed
  const breathsToTrigger = 2;       // Number of breaths before timer
  const holdDuration = 5;          // seconds
  const getReadyDuration = 5;       // seconds
  const timerDuration = 5;         // seconds


  const getCurrentRoundLabel = () => {
  const isActivePhase = showStopwatch || showTimer || showHold || showGetReady;
  return Math.min(roundCount + (isActivePhase ? 1 : 0), maxRounds);
};

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
//Hold phase
  useEffect(() => {
  if (showHold) {
    setHoldTimeLeft(holdDuration); // reset to full duration
    const interval = setInterval(() => {
      setHoldTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowHold(false);
          setShowGetReady(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }
}, [showHold]);
  // Stopwatch (In/Out phase)
  useEffect(() => {
    let interval = null;
    if (showStopwatch) {
      interval = setInterval(() => {
        setStopwatchTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showStopwatch]);

  // Switch to Timer after breaths
  useEffect(() => {
    const breaths = Math.floor(stopwatchTime / 2);
    if (stopwatchTime === 0) return;

    if (showStopwatch && breaths >= breathsToTrigger) {
      setShowStopwatch(false);
      setStopwatchTime(0);
      setShowTimer(true);
      setIsPlaying(true);
    }
  }, [stopwatchTime]);

  // Handle Countdown → Hold phase
  const onCountdownComplete = () => {
    setShowTimer(false);
    setIsPlaying(false);
    setShowHold(true); // ⬅️ now starts the hold phase
  };

  // Handle Get Ready → Next round or Session End
  useEffect(() => {
    if (!showGetReady) return;

    const timeout = setTimeout(() => {
      setShowGetReady(false);
      const nextRound = roundCount + 1;
      if (nextRound >= maxRounds) {
        setSessionComplete(true);
      } else {
        setRoundCount(nextRound);
        setShowStopwatch(true);
      }
    }, getReadyDuration * 1000);

    return () => clearTimeout(timeout);
  }, [showGetReady]);

  return (
    <View style={styles.container}>
    <Text style={{ fontSize: 18, marginBottom: 20 }}>
      Round: {getCurrentRoundLabel()} / {maxRounds}
    </Text>

      {/* In/Out Phase */}
      {showStopwatch && (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={{ fontSize: 40 }}>{stopwatchTime % 2 === 0 ? 'In' : 'Out'}</Text>
          <Text style={{ fontSize: 20, marginTop: 8 }}>
            Number of Breaths: {Math.floor(stopwatchTime / 2) + 1}
          </Text>
        </View>
      )}

      {/* Countdown Timer Phase */}
      {showTimer && (
        <CountdownCircleTimer
          isPlaying={isPlaying}
          duration={timerDuration}
          colors={['#004777', '#F7B801', '#A30000', '#A30000']}
          colorsTime={[7, 5, 2, 0]}
          onComplete={() => {
            onCountdownComplete();
            return { shouldRepeat: false };
          }}
        >
          {({ remainingTime }) => <Text style={{ fontSize: 25 }}>{formatTime(remainingTime)}</Text>}
        </CountdownCircleTimer>
      )}

      {showHold && (
  <View style={{ alignItems: 'center', marginTop: 20 }}>
    <Text style={{ fontSize: 32, color: '#A30000', marginBottom: 10 }}>
      Hold Your Breath
    </Text>
    <Text style={{ fontSize: 25 }}>
      {formatTime(holdTimeLeft)}
    </Text>
  </View>
)}

      {/* Get Ready Phase */}
      {showGetReady && (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={{ fontSize: 30, color: '#004777' }}>
          {roundCount + 1 >= maxRounds ? 'Let your breathing return to normal' : 'Get Ready'}
          </Text>
          {roundCount + 1 < maxRounds && (
          <Text style={{ fontSize: 18, marginTop: 10 }}>
          Next round starting in {getReadyDuration} seconds...
          </Text>    
        )}
        </View>
      )}

      {/* Session Complete */}
      {sessionComplete && (
        <Text style={{ fontSize: 28, marginTop: 40, color: 'green', fontWeight: 'bold' }}>
          Session Complete 🎉
        </Text>
      )}

      {/* Manual Start/Pause Button */}
      <TouchableOpacity style={styles.button} onPress={() => setIsPlaying(prev => !prev)}>
        <Text style={styles.buttonText}>{isPlaying ? 'Pause' : 'Start'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#004777',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});