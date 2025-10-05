// ProfileScreen.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ProfileScreen: React.FC = () => {
  return (
    <View style={styles.screen}>
      <Text style={styles.screenText}>Profile Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  screenText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
});

export default ProfileScreen;