// components/TopQuickSettings.js
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';

const BAR_H = 56;
const DEFAULT_HOTZONE = 36;
const AUTO_HIDE_MS = 1500;

export default function TopQuickSettings({
  values,
  onChange,
  autoShowOnMount = true,
  hotzoneHeight = DEFAULT_HOTZONE,
  enabled = true,
}) {
  const insets = useSafeAreaInsets();

  const [open, setOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [contentH, setContentH] = useState(0);
  const [clipH, setClipH] = useState(0);

  const ty = useRef(new Animated.Value(0)).current;        // slides -contentH → 0
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const hideTimer = useRef(null);
  const pendingOpen = useRef(false);
  const didAutoShow = useRef(false);

  if (!enabled) return null;

  const clearHideTimer = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  const showHeader = () => {
    if (!headerVisible) setHeaderVisible(true);
    Animated.timing(headerOpacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
  };

  const hideHeader = () => {
    if (open || !headerVisible) return;
    Animated.timing(headerOpacity, { toValue: 0, duration: 180, useNativeDriver: true })
      .start(({ finished }) => finished && setHeaderVisible(false));
  };

  // Single authority for auto-hide
  useEffect(() => {
    clearHideTimer();
    if (open) {
      showHeader();
      return;
    }
    if (headerVisible) {
      hideTimer.current = setTimeout(hideHeader, AUTO_HIDE_MS);
    }
    return clearHideTimer;
  }, [open, headerVisible]);

  // Auto-show once on first mount
  useEffect(() => {
    if (autoShowOnMount && !didAutoShow.current) {
      didAutoShow.current = true;
      showHeader();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reveal = () => {
    showHeader();
  };

  const doOpen = () => {
    if (!headerVisible) return;
    if (!contentH) { pendingOpen.current = true; return; }
    clearHideTimer();
    setOpen(true);
    setClipH(contentH);
    ty.setValue(-contentH);
    Animated.timing(ty, { toValue: 0, duration: 220, useNativeDriver: true }).start();
  };

  const doClose = () => {
    if (!contentH) { setOpen(false); setClipH(0); return; }
    setOpen(false);
    Animated.timing(ty, { toValue: -contentH, duration: 220, useNativeDriver: true })
      .start(() => setClipH(0));
  };

  const toggle = () => (open ? doClose() : doOpen());

  const handleMeasured = (h) => {
    if (!h) return;
    setContentH(h);
    ty.setValue(open ? 0 : -h);
    setClipH(open ? h : 0);
    if (pendingOpen.current && !open) {
      pendingOpen.current = false;
      doOpen();
    }
  };

  // Generic stepper row
  const Row = ({ label, keyName, min = 0, max = Infinity }) => {
    const val = Number(values[keyName] ?? 0);
    const dec = () => onChange({ [keyName]: Math.max(min, val - 1) });
    const inc = () => onChange({ [keyName]: Math.min(max, val + 1) });

    return (
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.controls}>
          <Pressable style={styles.btn} onPress={dec} hitSlop={8}>
            <Text style={styles.btnTxt}>–</Text>
          </Pressable>
          <Text style={styles.value}>{String(val)}</Text>
          <Pressable style={styles.btn} onPress={inc} hitSlop={8}>
            <Text style={styles.btnTxt}>+</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const hotzoneActive = !headerVisible && !open;

  return (
    <View style={[styles.wrap, { top: insets.top, left: 0, right: 0 }]} pointerEvents="box-none">
      {/* Bigger hotzone to reveal header when hidden */}
      <Pressable
        onPress={reveal}
        style={[styles.hotzone, { height: hotzoneHeight }]}
        pointerEvents={hotzoneActive ? 'auto' : 'none'}
      />

      {/* Header (fades; only tappable when visible) */}
      <Animated.View
        style={[styles.bar, { opacity: headerOpacity }]}
        pointerEvents={headerVisible ? 'auto' : 'none'}
      >
        <Pressable style={styles.barHit} onPress={toggle} hitSlop={12}>
          <Text style={styles.barText}>Settings</Text>
          <Text style={styles.chev}>{open ? '▴' : '▾'}</Text>
        </Pressable>
      </Animated.View>

      {/* Panel (clip toggled; inner slides) */}
      <View style={[styles.clip, { height: clipH }]} pointerEvents={open ? 'auto' : 'none'}>
        <Animated.View style={{ transform: [{ translateY: ty }] }}>
          <View onLayout={(e) => handleMeasured(e.nativeEvent.layout.height)} style={styles.inner}>
            {/* Rounds */}
            <Row label="Rounds" keyName="maxRounds" min={1} max={20} />

            {/* Breaths per round */}
            <Row label="Breaths per round" keyName="breathsToTrigger" min={1} max={200} />

            {/* Countdown (sec) — slider updates timerDuration */}
            <View style={styles.sliderBlock}>
              <View style={styles.sliderHeader}>
                <Text style={styles.label}>Countdown (sec)</Text>
                <Text style={styles.sliderValue}>{values.timerDuration}s</Text>
              </View>
              <Slider
                style={styles.slider}
                value={Number(values.timerDuration ?? 1)}
                minimumValue={1}
                maximumValue={120}
                step={1}
                onValueChange={(v) => onChange({ timerDuration: Math.round(v) })}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="rgba(255,255,255,0.25)"
                thumbTintColor="#FFFFFF"
              />
            </View>

            <Pressable style={styles.close} onPress={doClose} hitSlop={10}>
              <Text style={styles.closeTxt}>▴ Close</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', zIndex: 999 },
  hotzone: { position: 'absolute', top: 0, left: 0, right: 0 },

  bar: {
    height: BAR_H,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    justifyContent: 'center',
  },
  barHit: {
    flex: 1,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  barText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  chev: { color: '#fff', fontSize: 16 },

  clip: { overflow: 'hidden' },
  inner: {
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },

  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { color: '#fff', fontSize: 14 },

  controls: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  btn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  btnTxt: { color: '#fff', fontSize: 18, fontWeight: '700' },
  value: { color: '#fff', fontSize: 16, minWidth: 36, textAlign: 'center' },

  sliderBlock: { marginTop: 8 },
  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: -2 },
  sliderValue: { color: '#fff', fontSize: 14 },
  slider: { width: '100%', height: 36 },

  close: { alignSelf: 'center', marginTop: 6, paddingVertical: 6, paddingHorizontal: 10 },
  closeTxt: { color: '#fff', opacity: 0.9 },
});