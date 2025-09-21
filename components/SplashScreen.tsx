import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface SimpleSplashProps {
  onFinish: () => void;
}

export default function SimpleSplash({ onFinish }: SimpleSplashProps) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Fade in
    opacity.value = withTiming(1, { duration: 5000 }, () => {
      // Wait a bit, then fade out and finish
      opacity.value = withTiming(0, { duration: 500 }, () => {
        runOnJS(onFinish)();
      });
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.appName}>SageSpeaks</Text>
      <Text style={styles.tagline}>Smart Communication</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});