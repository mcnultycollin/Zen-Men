import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopQuickSettings from '../components/TopQuickSettings';
import StartCTA from '../components/StartCTA';
import { Audio } from 'expo-av';
import { setSoundFns } from '../hooks/soundRegistry';

export default function HomeScreen({ navigation, configApi }) {
  const { config, patch } = configApi;

  // --- fade-in animation (unchanged) ---
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 250, useNativeDriver: true }).start();
  }, [fade]);

  // --- audio preload/warm (new) ---
  const inhaleRef = useRef(null);
  const exhaleRef = useRef(null);
  const [audioReady, setAudioReady] = useState(false);

  useEffect(() => {
    let alive = true;

    async function warm(sound) {
      await sound.setVolumeAsync(0);
      await sound.playFromPositionAsync(0);
      await sound.pauseAsync();
      await sound.setVolumeAsync(1);
      await sound.setPositionAsync(0);
    }

    async function load() {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      const [inhaleObj, exhaleObj] = await Promise.all([
        Audio.Sound.createAsync(require('../assets/inhale1.mp3')),
        Audio.Sound.createAsync(require('../assets/exhale1.mp3')),
      ]);

      if (!alive) return;

      inhaleRef.current = inhaleObj.sound;
      exhaleRef.current = exhaleObj.sound;

      await warm(inhaleRef.current);
      await warm(exhaleRef.current);

      if (!alive) return;

      // expose play fns globally (no context, no prop drilling)
      setSoundFns({
        playInhale: async () => {
          if (!inhaleRef.current) return;
          await inhaleRef.current.setPositionAsync(0);
          await inhaleRef.current.playAsync();
        },
        playExhale: async () => {
          if (!exhaleRef.current) return;
          await exhaleRef.current.setPositionAsync(0);
          await exhaleRef.current.playAsync();
        },
      });

      setAudioReady(true);
    }

    load();

    return () => {
      alive = false;
      // keep loaded to avoid re-warm on back nav; uncomment to free memory:
      // inhaleRef.current?.unloadAsync();
      // exhaleRef.current?.unloadAsync();
    };
  }, []);

  const handleStart = () => {
    // optional guard to avoid hitting Phase before sounds are ready
    if (!audioReady) return;
    navigation.replace('Phase');
  };

  return (
    <View style={styles.root}>
      <SafeAreaView style={{ flex: 1 }}>
        <TopQuickSettings
          values={config}
          onChange={patch}
          autoShowOnMount
          hotzoneHeight={48}
          enabled
        />

        <Animated.View style={[StyleSheet.absoluteFill, { opacity: fade }]} pointerEvents="auto">
          <View style={styles.centerOverlay}>
            <StartCTA onStart={handleStart} disabled={!audioReady} />
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  centerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
