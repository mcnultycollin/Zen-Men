// components/SessionComplete.js
import { Text, View, StyleSheet } from 'react-native';
import { phaseStyles } from './styles/phaseStyles';

export default function SessionComplete() {
  return (
    <View>
      <Text style={phaseStyles.title}>Session Complete.</Text>
    </View>
  );
}

