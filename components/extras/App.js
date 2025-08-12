// App.js
import 'react-native-reanimated';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import PhaseManager, { usePhase } from './components/PhaseManager';
import { phaseStyles } from './components/styles/phaseStyles';
import VideoBackground from './components/VideoBackground';
import TopQuickSettings from './components/TopQuickSettings';
import StartScreen from './components/StartScreen';

export default function App() {
  const [started, setStarted] = useState(false);

  const [config, setConfig] = useState({
    breathsToTrigger: 3,
    timerDuration: 2,
    holdDuration: 3,
    getReadyDuration: 2,
    maxRounds: 2,
  });
  const patchConfig = (partial) => setConfig(prev => ({ ...prev, ...partial }));

  return (
    <SafeAreaProvider>
      <View style={phaseStyles.root}>
        {/* Full-bleed background video */}
        <View style={phaseStyles.bgLayer} pointerEvents="none">
          <VideoBackground source={require('./assets/flowers3_vertical.mp4')} fit="cover" />
        </View>

        {/* Foreground UI inside safe area */}
        <View style={phaseStyles.overlayLayer} pointerEvents="auto">
          <SafeAreaView style={{ flex: 1 }}>
            {!started ? (
              <>
                {/* Top menu visible on Start screen only */}
                <TopQuickSettings
                  values={config}
                  onChange={patchConfig}
                  autoShowOnMount={true}
                  hotzoneHeight={48}       // bigger reveal area
                  enabled={true}
                />
                <StartScreen onStart={() => setStarted(true)} />
              </>
            ) : (
              <>
                {/* Hide menu during flow */}
                {/* <TopQuickSettings enabled={false} ... /> */}
                <View style={phaseStyles.container}>
                  <PhaseManager config={config}>
                    <ControlBar />
                  </PhaseManager>
                </View>
              </>
            )}
          </SafeAreaView>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

function ControlBar() {
  const { currentRound, maxRounds } = usePhase();
  return (
    <Text style={phaseStyles.roundText}>
      Round: {currentRound} / {maxRounds}
    </Text>
  );
}