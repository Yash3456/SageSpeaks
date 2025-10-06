// app/(tabs)/index.tsx
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';

export default function LoadingScreen() {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <View style={styles.container}>

      {/* Scrollable Skeleton Layout */}
      <ScrollView style={styles.content}>
        <LoadingSkeleton shimmerOpacity={shimmerOpacity} />
      </ScrollView>
    </View>
  );
}

/* 🔸 Skeleton Component */
const LoadingSkeleton = ({
  shimmerOpacity,
}: {
  shimmerOpacity: Animated.AnimatedInterpolation<number>;
}) => {
  return (
    <View style={styles.Alignment}>
      {/* Welcome Card Placeholder */}
      <View style={styles.welcomeCard}>
        <Animated.View style={[styles.skeletonTitle, { opacity: shimmerOpacity }]} />
        <Animated.View style={[styles.skeletonSubtitle, { opacity: shimmerOpacity }]} />
        <Animated.View style={[styles.skeletonBox, { opacity: shimmerOpacity }]} />
      </View>

      {/* Stats Section Placeholder */}
      <View style={styles.sectionCard}>
        <Animated.View
          style={[styles.skeletonTitle, { opacity: shimmerOpacity, width: '50%' }]}
        />
        <Animated.View style={[styles.skeletonBoxSmall, { opacity: shimmerOpacity }]} />
        <Animated.View style={[styles.skeletonBoxSmall, { opacity: shimmerOpacity }]} />
      </View>

      {/* Progress Section Placeholder */}
      <View style={styles.sectionCard}>
        <Animated.View
          style={[styles.skeletonTitle, { opacity: shimmerOpacity, width: '50%' }]}
        />
        <Animated.View style={[styles.skeletonBoxSmall, { opacity: shimmerOpacity }]} />
        <Animated.View style={[styles.skeletonBoxSmall, { opacity: shimmerOpacity }]} />
      </View>

      {/* Activity Section Placeholder */}
      <View style={styles.sectionCard}>
        <Animated.View
          style={[styles.skeletonTitle, { opacity: shimmerOpacity, width: '40%' }]}
        />
        <Animated.View
          style={[styles.skeletonBox, { opacity: shimmerOpacity, height: 70 }]}
        />
        <Animated.View
          style={[
            styles.skeletonBox,
            { opacity: shimmerOpacity, height: 70, marginTop: 10 },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  Alignment:{marginTop:30},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4A90E2',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  iconButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  content: { flex: 1 },
  welcomeCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
  },
  sectionCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginVertical: 8,
    padding: 20,
    borderRadius: 12,
  },

  /* Skeleton Styles */
  skeletonTitle: {
    width: '60%',
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    marginBottom: 10,
  },
  skeletonSubtitle: {
    width: '40%',
    height: 14,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    marginBottom: 14,
  },
  skeletonBox: {
    width: '100%',
    height: 80,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
  },
  skeletonBoxSmall: {
    width: '100%',
    height: 50,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    marginTop: 10,
  },
});
