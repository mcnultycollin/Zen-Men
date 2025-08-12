import React, { useEffect, useRef } from 'react';
import { View, Animated, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PhaseManager, { usePhase } from '../components/PhaseManager';
import { phaseStyles } from '../components/styles/phaseStyles';

export default function PhaseScreen({ navigation, configApi }) {
  const { config } = configApi;

const fade = useRef(new Animated.Value(0)).current;
useEffect(() => {
Animated.timing(fade, { toValue: 1, duration: 250, useNativeDriver: true }).start();
}, [fade]);

  return (
    <View style={styles.root}>
    <SafeAreaView style={{ flex: 1 }}>
    <Animated.View style={[StyleSheet.absoluteFill, { opacity: fade }]} pointerEvents="auto">
        <View style={phaseStyles.container}>
          <PhaseManager config={config}>
            <ControlBar />
          </PhaseManager>
        </View>
      </Animated.View>
    </SafeAreaView>
    </View>
  );
}

function ControlBar() {
  const { currentRound, maxRounds } = usePhase();
  return <Text style={phaseStyles.roundText}>Round: {currentRound} / {maxRounds}</Text>;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  backBtn: {
    alignSelf: 'flex-start',
    marginTop: 8,
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  backTxt: { color: '#fff', fontSize: 14 },
});
