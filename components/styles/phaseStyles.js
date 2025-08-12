// components/styles/phaseStyles.js
import { StyleSheet } from 'react-native';

export const phaseStyles = StyleSheet.create({
  // App layout layers
  root: {
    flex: 1,
    backgroundColor: 'black',
  },
  bgLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  overlayLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },

  // Your existing styles
  container: {
    flex: 1,                   // Fill available space
    justifyContent: 'center',  // Center vertically
    alignItems: 'center',      // Center horizontally
    padding: 16,               // Optional: padding for breathing room
  },
  title: {
    fontSize: 32,
    color: '#f7f7f7ff',
    marginBottom: 10,
  },
  timer: {
    fontSize: 25,
    color: '#f7f7f7ff',
  },
  subtext: {
    fontSize: 18,
    color: '#f7f7f7ff',
  },
  roundText: {
    fontSize: 18,
    color: '#f7f7f7ff',
    padding: 10,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});