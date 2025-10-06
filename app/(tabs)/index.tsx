import LoadingScreen from '@/components/loadingScreen';
import { Ionicons } from '@expo/vector-icons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { router, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

type DrawerNavigation = DrawerNavigationProp<any>;

export default function HomeScreen() {
  const navigation = useNavigation<DrawerNavigation>();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    // Simulate initial loading (5 seconds)
    const timer = setTimeout(() => setIsLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Commented API calls — simulated data fetching
      // await Promise.all([
      //   fetchStats(),
      //   fetchActivity(),
      // ]);
      await new Promise(resolve => setTimeout(resolve, 1500)); // simulate refresh delay
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to refresh:', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoading) return <LoadingScreen />;

  if(refreshing) return <LoadingScreen />;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.openDrawer()}
          style={styles.iconButton}
        >
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Home</Text>

        <TouchableOpacity 
          onPress={() => router.push("/Notifications")}
          style={styles.iconButton}
        >
          <Ionicons name="notifications-outline" size={26} color="#fff" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content with Pull-to-Refresh */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4A90E2', '#50C878']} // Android colors
            tintColor="#4A90E2" // iOS color
            progressBackgroundColor="#fff"
          />
        }
      >
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome Back!</Text>
          <Text style={styles.welcomeSubtitle}>
            Last updated: {lastRefresh.toLocaleTimeString()}
          </Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="cube-outline" size={32} color="#4A90E2" />
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Projects</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle-outline" size={32} color="#50C878" />
            <Text style={styles.statNumber}>18</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="time-outline" size={32} color="#FFA500" />
            <Text style={styles.statNumber}>6</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="people-outline" size={32} color="#9B59B6" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Team</Text>
          </View>
        </View>

        {/* Recent Activity Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>

          <View style={styles.activityItem}>
            <Ionicons name="document-text-outline" size={24} color="#4A90E2" />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>New document uploaded</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>

          <View style={styles.activityItem}>
            <Ionicons name="person-add-outline" size={24} color="#50C878" />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>New team member joined</Text>
              <Text style={styles.activityTime}>5 hours ago</Text>
            </View>
          </View>

          <View style={styles.activityItem}>
            <Ionicons name="checkmark-done-outline" size={24} color="#9B59B6" />
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Task completed</Text>
              <Text style={styles.activityTime}>1 day ago</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// Styles remain consistent
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4A90E2',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
    elevation: 5,
  },
  iconButton: { padding: 8, position: 'relative' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  badge: {
    position: 'absolute',
    right: 6,
    top: 6,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  content: { flex: 1 },
  welcomeCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeTitle: { fontSize: 24, fontWeight: 'bold', color: '#2C3E50' },
  welcomeSubtitle: { fontSize: 14, color: '#7F8C8D', marginTop: 8 },
  statsContainer: { flexDirection: 'row', paddingHorizontal: 15, marginBottom: 15, gap: 15 },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: '#2C3E50', marginTop: 8 },
  statLabel: { fontSize: 12, color: '#7F8C8D', marginTop: 4 },
  section: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2C3E50', marginBottom: 15 },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  activityContent: { marginLeft: 15, flex: 1 },
  activityTitle: { fontSize: 14, color: '#2C3E50', marginBottom: 4 },
  activityTime: { fontSize: 12, color: '#95A5A6' },
});
