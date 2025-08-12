import { useEffect, useState, createContext, useContext } from 'react';
import BreathingPhase from './BreathingPhase';
import CountdownPhase from './CountdownPhase';
import HoldPhase from './HoldPhase';
import GetReadyPhase from './GetReadyPhase';
import SessionComplete from './SessionComplete';

export const PhaseContext = createContext();

export function usePhase() {
  return useContext(PhaseContext);
}

export default function PhaseManager({ config, children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showStopwatch, setShowStopwatch] = useState(true);
  const [showTimer, setShowTimer] = useState(false);
  const [showHold, setShowHold] = useState(false);
  const [showGetReady, setShowGetReady] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [roundCount, setRoundCount] = useState(0);

  const {
    breathsToTrigger,
    timerDuration,
    holdDuration,
    getReadyDuration,
    maxRounds
  } = config;


  const getCurrentRoundLabel = () => {
  if (sessionComplete) return maxRounds;
  const isActive = showStopwatch || showTimer || showHold || showGetReady;
  return Math.min(roundCount + (isActive ? 1 : 0), maxRounds);
};


  useEffect(() => {
    let interval;
    if (showStopwatch) {
      interval = setInterval(() => {
        setStopwatchTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showStopwatch]);

  useEffect(() => {
    const breaths = Math.floor(stopwatchTime / 2);
    if (stopwatchTime > 0 && breaths >= breathsToTrigger) {
      setShowStopwatch(false);
      setStopwatchTime(0);
      setShowTimer(true);
      setIsPlaying(true);
    }
  }, [stopwatchTime]);

  const onCountdownComplete = () => {
    setShowTimer(false);
    setIsPlaying(false);
    setShowHold(true);
  };

  const handleHoldDone = () => {
    setShowHold(false);
    setShowGetReady(true);
  };

  const handleGetReadyDone = () => {
    const nextRound = roundCount + 1;
    if (nextRound >= maxRounds) {
      setSessionComplete(true);
    } else {
      setRoundCount(nextRound);
      setShowStopwatch(true);
    }
    setShowGetReady(false);
  };

const contextValue = {
  isPlaying,
  setIsPlaying,
  currentRound: getCurrentRoundLabel(),
  maxRounds,
  stopwatchTime, // <-- ADD THIS
};

  return (
    <PhaseContext.Provider value={contextValue}>
      {sessionComplete && <SessionComplete />}
      {showGetReady && <GetReadyPhase duration={getReadyDuration} onComplete={handleGetReadyDone} />}
      {showHold && <HoldPhase duration={holdDuration} onComplete={handleHoldDone} />}
      {showTimer && (
        <CountdownPhase
          isPlaying={isPlaying}
          duration={timerDuration}
          onComplete={onCountdownComplete}
          formatTime={(s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`}
        />
      )}
      {showStopwatch && <BreathingPhase stopwatchTime={stopwatchTime} />}
      {children}
    </PhaseContext.Provider>
  );
}
