import SettingsScreen from '@/screens/SettingsScreen';
import { View, StyleSheet } from 'react-native';

export default function Settings() {
  return (
    <View style={styles.container}>
      <SettingsScreen></SettingsScreen>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
