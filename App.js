// App.js
import 'react-native-reanimated';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VideoBackground from './components/VideoBackground';
import HomeScreen from './screens/HomeScreen';
import PhaseScreen from './screens/PhaseScreen';


const Stack = createNativeStackNavigator();

export default function App() {

  const [config, setConfig] = useState({
    breathsToTrigger: 3,
    timerDuration: 2,
    holdDuration: 3,
    getReadyDuration: 2,
    maxRounds: 2,
  });

  const patchConfig = (partial) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  };

  const configApi = {
    config,
    patch: patchConfig,
  };

  return ( 
    <View style={styles.root}>
      {/* Persistent video background */}
      <View style={styles.bgLayer} pointerEvents="none">
        <VideoBackground fit="cover" />
      </View>

      {/* Foreground app content */}
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' }, // no white flicker
          }}
        >
          <Stack.Screen name="Home">
            {(props) => <HomeScreen {...props} configApi={configApi} />}
          </Stack.Screen>
          <Stack.Screen name="Phase">
            {(props) => <PhaseScreen {...props} configApi={configApi} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  bgLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1, // keep it behind everything
  },
});
