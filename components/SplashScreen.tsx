import React, { useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

interface SimpleSplashProps {
  onFinish: () => void;
}

export default function SimpleSplash({ onFinish }: SimpleSplashProps) {
  const logoScale = useSharedValue(0);
  const appNameScale = useSharedValue(0);
  const taglineScale = useSharedValue(0);

  useEffect(() => {
    // Logo pops out first
    logoScale.value = withSpring(1, { 
      damping: 10,
      stiffness: 100,
    });

    // App name pops out after 300ms
    setTimeout(() => {
      appNameScale.value = withSpring(1, {
        damping: 12,
        stiffness: 120,
      });
    }, 300);

    // Tagline pops out after 600ms
    setTimeout(() => {
      taglineScale.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
      });
    }, 600);

    // After all animations complete, wait a bit then finish
    setTimeout(() => {
      runOnJS(onFinish)();
    }, 5000); // Total time: 600ms + 500ms animation + 1400ms wait

  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const appNameAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: appNameScale.value }],
  }));

  const taglineAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: taglineScale.value }],
  }));

  return (
    <Animated.View style={styles.container}>
      <Animated.View style={logoAnimatedStyle}>
        <Image
          source={require('../assets/images/sagespeakslogo.png')}
          style={styles.logo}
          resizeMode="cover"
        />
      </Animated.View>
      
      <Animated.Text style={[styles.appName, appNameAnimatedStyle]}>
        SageSpeaks
      </Animated.Text>
      
      <Animated.Text style={[styles.tagline, taglineAnimatedStyle]}>
        Your intelligent business companion
      </Animated.Text>
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
  logo: {
    width: 320,
    height: 320,
    marginBottom: 20,
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