import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

interface CheckingDetailsProps {
  onFinish: () => void;
}

export default function CheckingDetails({ onFinish }: CheckingDetailsProps) {
  const logoScale = useSharedValue(0);
  const messageOpacity = useSharedValue(0);
  const dotOpacity1 = useSharedValue(0);
  const dotOpacity2 = useSharedValue(0);
  const dotOpacity3 = useSharedValue(0);
  const checkmarkScale = useSharedValue(0);
  const successMessageOpacity = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    // Logo pops in
    logoScale.value = withSpring(1, {
      damping: 10,
      stiffness: 100,
    });

    // Pulse animation for logo
    setTimeout(() => {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }, 300);

    // Message fades in
    setTimeout(() => {
      messageOpacity.value = withTiming(1, { duration: 500 });
    }, 400);

    // Animated dots
    setTimeout(() => {
      dotOpacity1.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0.3, { duration: 400 })
        ),
        -1,
        false
      );
    }, 800);

    setTimeout(() => {
      dotOpacity2.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0.3, { duration: 400 })
        ),
        -1,
        false
      );
    }, 1000);

    setTimeout(() => {
      dotOpacity3.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0.3, { duration: 400 })
        ),
        -1,
        false
      );
    }, 1200);

    // After checking animation, show success
    setTimeout(() => {
      // Stop pulse
      pulseScale.value = withTiming(1, { duration: 300 });
      
      // Show checkmark
      checkmarkScale.value = withSpring(1, {
        damping: 8,
        stiffness: 150,
      });

      // Show success message
      successMessageOpacity.value = withTiming(1, { duration: 500 });
    }, 3000);

    // Finish after showing success
    setTimeout(() => {
      runOnJS(onFinish)();
    }, 4500);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value * pulseScale.value }],
  }));

  const messageAnimatedStyle = useAnimatedStyle(() => ({
    opacity: messageOpacity.value,
  }));

  const dot1AnimatedStyle = useAnimatedStyle(() => ({
    opacity: dotOpacity1.value,
  }));

  const dot2AnimatedStyle = useAnimatedStyle(() => ({
    opacity: dotOpacity2.value,
  }));

  const dot3AnimatedStyle = useAnimatedStyle(() => ({
    opacity: dotOpacity3.value,
  }));

  const checkmarkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkmarkScale.value }],
    opacity: checkmarkScale.value,
  }));

  const successMessageAnimatedStyle = useAnimatedStyle(() => ({
    opacity: successMessageOpacity.value,
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

      {/* Checking message with animated dots */}
      <Animated.View style={[styles.messageContainer, messageAnimatedStyle]}>
        <Animated.Text style={styles.message}>
          Sage is checking your details
        </Animated.Text>
        <View style={styles.dotsContainer}>
          <Animated.Text style={[styles.dot, dot1AnimatedStyle]}>●</Animated.Text>
          <Animated.Text style={[styles.dot, dot2AnimatedStyle]}>●</Animated.Text>
          <Animated.Text style={[styles.dot, dot3AnimatedStyle]}>●</Animated.Text>
        </View>
      </Animated.View>

      <Animated.Text style={[styles.holdTight, messageAnimatedStyle]}>
        Hold tight!
      </Animated.Text>

      {/* Success checkmark */}
      <Animated.View style={[styles.checkmarkContainer, checkmarkAnimatedStyle]}>
        <Animated.Text style={styles.checkmark}>✓</Animated.Text>
      </Animated.View>

      {/* Success message */}
      <Animated.Text style={[styles.successMessage, successMessageAnimatedStyle]}>
        All set! Welcome aboard
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
    width: 280,
    height: 280,
    marginBottom: 40,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 4,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 40,
  },
  dot: {
    fontSize: 20,
    color: '#ffffff',
    marginHorizontal: 2,
  },
  holdTight: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  checkmarkContainer: {
    position: 'absolute',
    top: '50%',
    marginTop: -80,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 50,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  successMessage: {
    position: 'absolute',
    bottom: 100,
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
});