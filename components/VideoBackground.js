// components/VideoBackground.js
import React, { useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';

export default function VideoBackground({
  source = require('../assets/lava_vertical.mp4'),
  rotate90 = false,
  direction = 'cw',        // 'cw' or 'ccw'
  fit = 'cover',           // 'cover' | 'contain' | 'fill'
  muted = true,
  loop = true,
}) {
  const { width: W, height: H } = useWindowDimensions();

  const player = useVideoPlayer(source, (p) => {
    p.loop = loop;
    p.muted = muted;
    p.play();
  });

  const style = useMemo(() => {
    if (!rotate90) {
      return {
        position: 'absolute',
        width: W,
        height: H,
        left: 0,
        top: 0,
      };
    }
    const rot = direction === 'ccw' ? '-90deg' : '90deg';
    return {
      position: 'absolute',
      width: H,
      height: W,
      left: (W - H) / 2,
      top: (H - W) / 2,
      transform: [{ rotate: rot }],
    };
  }, [W, H, rotate90, direction]);

  return (
    <VideoView
      player={player}
      style={style}
      contentFit={fit}
      nativeControls={false}
      allowsFullscreen={false}
      allowsPictureInPicture={false}
      pointerEvents="none"
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
});
