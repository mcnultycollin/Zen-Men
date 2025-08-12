// components/CrossfadeVideoBackground.js
import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';

const FADE_MS = 650;

export default function CrossfadeVideoBackground({ source, fit = 'cover', muted = true }) {
  // We alternate between two layers so we can crossfade
  const [useA, setUseA] = useState(true);       // which layer is currently visible
  const [srcA, setSrcA] = useState(source);
  const [srcB, setSrcB] = useState(source);

  const A = useVideoPlayer(srcA, (p) => { p.loop = true; p.muted = muted; p.play(); });
  const B = useVideoPlayer(srcB, (p) => { p.loop = true; p.muted = muted; p.play(); });

  const aOpacity = useSharedValue(1); // A starts visible
  const bOpacity = useSharedValue(0);

  const aStyle = useAnimatedStyle(() => ({ opacity: aOpacity.value }));
  const bStyle = useAnimatedStyle(() => ({ opacity: bOpacity.value }));

  // When "source" prop changes, load it into the hidden layer and crossfade it in
  useEffect(() => {
    const showB = !useA;
    if (showB) {
      // A is visible → update B, play, fade B in
      setSrcB(source);
      // wait a tick for B to mount
      requestAnimationFrame(() => {
        try { B.seek(0); } catch {}
        try { B.play(); } catch {}
        bOpacity.value = 0;
        aOpacity.value = 1;
        bOpacity.value = withTiming(1, { duration: FADE_MS }, () => runOnJS(setUseA)(false));
        aOpacity.value = withTiming(0, { duration: FADE_MS });
      });
    } else {
      // B is visible → update A, play, fade A in
      setSrcA(source);
      requestAnimationFrame(() => {
        try { A.seek(0); } catch {}
        try { A.play(); } catch {}
        aOpacity.value = 0;
        bOpacity.value = 1;
        aOpacity.value = withTiming(1, { duration: FADE_MS }, () => runOnJS(setUseA)(true));
        bOpacity.value = withTiming(0, { duration: FADE_MS });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  return (
    <>
      {/* Bottom layer (A) */}
      <Animated.View style={[StyleSheet.absoluteFill, aStyle]} pointerEvents="none">
        <VideoView
          player={A}
          style={StyleSheet.absoluteFill}
          contentFit={fit}
          nativeControls={false}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          pointerEvents="none"
        />
      </Animated.View>

      {/* Top layer (B) */}
      <Animated.View style={[StyleSheet.absoluteFill, bStyle]} pointerEvents="none">
        <VideoView
          player={B}
          style={StyleSheet.absoluteFill}
          contentFit={fit}
          nativeControls={false}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          pointerEvents="none"
        />
      </Animated.View>
    </>
  );
}
