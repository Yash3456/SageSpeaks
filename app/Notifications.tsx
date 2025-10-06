// NotificationsScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchNotifications } from '../store/slices/notificationSlice';

// Mock notification data - replace with Redux state
const mockNotifications = [
  {
    id: '1',
    title: 'Welcome to the app!',
    message: 'Thank you for joining us. Explore all the amazing features.',
    timestamp: '2 hours ago',
    isRead: false,
    type: 'welcome',
  },
  {
    id: '2',
    title: 'New message received',
    message: 'You have a new message from John Doe.',
    timestamp: '4 hours ago',
    isRead: true,
    type: 'message',
  },
  {
    id: '3',
    title: 'Update available',
    message: 'A new version of the app is available for download.',
    timestamp: '1 day ago',
    isRead: false,
    type: 'update',
  },
  {
    id: '4',
    title: 'Payment successful',
    message: 'Your payment of $29.99 has been processed successfully.',
    timestamp: '2 days ago',
    isRead: true,
    type: 'payment',
  },
  {
    id: '5',
    title: 'Security alert',
    message: 'New login detected from a different device.',
    timestamp: '3 days ago',
    isRead: false,
    type: 'security',
  },
];

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: string;
}

const NotificationsScreen: React.FC = () => {
  const router = useRouter();
  
  // Redux hooks - uncomment when Redux is set up
  // const dispatch = useDispatch();
  // const { notifications, loading, error } = useSelector((state: any) => state.notifications);

  useEffect(() => {
    // Call API to fetch notifications when component mounts
    fetchNotificationsData();
  }, []);

  // API calling function via Redux - commented for now
  const fetchNotificationsData = async () => {
    try {
      // Uncomment and modify based on your Redux setup
      // dispatch(fetchNotifications());
      
      // Alternative direct API call (remove when using Redux)
      // const response = await fetch('YOUR_API_ENDPOINT/notifications', {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${yourAuthToken}`,
      //   },
      // });
      // const data = await response.json();
      // Handle the response data
      
      console.log('Fetching notifications...');
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleGoBack = () => {
    try {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      router.replace('/(tabs)');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'welcome':
        return 'gift-outline';
      case 'message':
        return 'mail-outline';
      case 'update':
        return 'download-outline';
      case 'payment':
        return 'card-outline';
      case 'security':
        return 'shield-outline';
      default:
        return 'notifications-outline';
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity style={styles.notificationItem}>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={getNotificationIcon(item.type) as any}
              size={24}
              color={item.isRead ? '#BDC3C7' : '#4A90E2'}
            />
          </View>
          <View style={styles.notificationTextContainer}>
            <Text style={[styles.notificationTitle, !item.isRead && styles.unreadTitle]}>
              {item.title}
            </Text>
            <Text style={styles.notificationMessage}>{item.message}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>


      {/* Notifications List */}
      <View style={styles.content}>
        {mockNotifications.length > 0 ? (
          <FlatList
            data={mockNotifications}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={64} color="#BDC3C7" />
            <Text style={styles.emptyStateText}>No notifications yet</Text>
            <Text style={styles.emptyStateSubtext}>
              When you have notifications, they'll appear here
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
  },
  placeholder: {
    width: 40, // Same width as back button for centering
  },
  content: {
    flex: 1,
    paddingTop: 8,
  },
  listContainer: {
    paddingBottom: 20,
  },
  notificationItem: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  notificationContent: {
    padding: 16,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3E50',
    marginBottom: 4,
  },
  unreadTitle: {
    fontWeight: '600',
    color: '#1A1A1A',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
    marginBottom: 6,
  },
  timestamp: {
    fontSize: 12,
    color: '#BDC3C7',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E74C3C',
    marginTop: 4,
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7F8C8D',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#BDC3C7',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default NotificationsScreen;
