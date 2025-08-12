import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopQuickSettings from '../components/TopQuickSettings';
import StartCTA from '../components/StartCTA';

export default function HomeScreen({ navigation, configApi }) {
  const { config, patch } = configApi;

  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 250, useNativeDriver: true }).start();
  }, [fade]);


  return (
    <View style={styles.root}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Quick settings visible only on Home */}
        <TopQuickSettings
          values={config}
          onChange={patch}
          autoShowOnMount
          hotzoneHeight={48}
          enabled
        />

        {/* Centered start button */}
    <Animated.View style={[StyleSheet.absoluteFill, { opacity: fade }]} pointerEvents="auto">
        <View style={styles.centerOverlay}>
          <StartCTA onStart={() => navigation.replace('Phase')} />
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
