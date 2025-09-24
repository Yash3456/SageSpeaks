// components/SimpleOnboarding.tsx
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    Image,
    PanResponder,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

const { width: screenWidth } = Dimensions.get("window");


interface SlideData {
  id: number;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundColor: string;
  buttonColor: string;
  image: any;
}

const slidesData: SlideData[] = [
  {
    id: 1,
    icon: "🧠",
    title: "AI-Powered Insights",
    subtitle: "Smart Business Intelligence",
    description:
      "Get intelligent insights and data-driven recommendations to make better business decisions faster than ever before.",
    backgroundColor: "#667eea",
    buttonColor: "#764ba2",
    image: { uri: "https://res.cloudinary.com/dpcc79tpa/image/upload/v1758170495/About_g0d1kb.svg" },
  },
  {
    id: 2,
    icon: "🚀",
    title: "Accelerate Growth",
    subtitle: "Scale Your Business",
    description:
      "Streamline your daily operations with AI automation and focus on what matters most - growing your business.",
    backgroundColor: "#f093fb",
    buttonColor: "#f5576c",
    image: { uri: "https://res.cloudinary.com/dpcc79tpa/image/upload/v1758170505/404mascot_xbfipy.svg" },
  },
  {
    id: 3,
    icon: "💡",
    title: "Your Business Companion",
    subtitle: "Always There When You Need",
    description:
      "Available 24/7 to help with strategic decisions, market analysis, and business planning. Your intelligent partner in success.",
    backgroundColor: "#4facfe",
    buttonColor: "#00f2fe",
    image: { uri: "https://res.cloudinary.com/dpcc79tpa/image/upload/v1758170528/privacy_by1uew.svg" },
  },
];

export default function SimpleOnboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidePosition = useSharedValue(0);

  const goToSlide = (index: number) => {
    slidePosition.value = withTiming(-index * screenWidth, { duration: 300 });
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    if (currentIndex < slidesData.length - 1) {
      goToSlide(currentIndex + 1);
    } else {
        router.push('/Onboarding/Login');
    }
  };

  const previousSlide = () => {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return (
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
        Math.abs(gestureState.dx) > 20
      );
    },
    onPanResponderRelease: (_, gestureState) => {
      const threshold = screenWidth * 0.3;
      const { dx, vx } = gestureState;

      if (dx > threshold || vx > 0.5) {
        previousSlide();
      } else if (dx < -threshold || vx < -0.5) {
        nextSlide();
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slidePosition.value }],
  }));

  const currentSlide = slidesData[currentIndex];

  return (
    <View
      style={[styles.container, { backgroundColor: currentSlide.backgroundColor }]}
    >
      <View style={styles.slidesWrapper} {...panResponder.panHandlers}>
        <Animated.View
          style={[styles.slidesContainer, { width: screenWidth * slidesData.length }, animatedStyle]}
        >
          {slidesData.map((slide) => (
            <View key={slide.id} style={[styles.slide, { width: screenWidth }]}>
              <Image source={slide.image} style={styles.image} resizeMode="contain" />
              <Text style={styles.icon}>{slide.icon}</Text>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.subtitle}>{slide.subtitle}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </View>
          ))}
        </Animated.View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          {slidesData.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dot,
                index === currentIndex ? styles.activeDot : styles.inactiveDot,
              ]}
              onPress={() => goToSlide(index)}
            />
          ))}
        </View>
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: currentSlide.buttonColor }]}
          onPress={nextSlide}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === slidesData.length - 1 ? "Let's Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  slidesWrapper: { flex: 1, overflow: "hidden" },
  slidesContainer: { flexDirection: "row", height: "100%" },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  image: {
    width: "80%",
    height: 200,
    marginBottom: 20,
  },
  icon: {
    fontSize: 50,
    marginBottom: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 30,
    paddingBottom: 40,
    alignItems: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    marginBottom: 25,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "white",
  },
  inactiveDot: {
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  nextButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 180,
    alignItems: "center",
  },
  nextButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
