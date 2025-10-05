// components/CustomDrawer.tsx
import { useAppDispatch, useAppSelector } from '@/lib/store/hook';
import { logoutUser, selectUser } from '@/lib/store/slices/UserSlice';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface MenuItem {
  name: string;
  icon: IoniconsName;
  route: string;
  color: string;
}

const CustomDrawer: React.FC<DrawerContentComponentProps> = (props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Get user from Redux store
  const user = useAppSelector(selectUser);

  const menuItems: MenuItem[] = [
    {
      name: 'Home',
      icon: 'home-outline',
      route: '/(home)',
      color: '#4A90E2'
    },
    {
      name: 'Modal',
      icon: 'help-circle-outline',
      route: '/modal',
      color: '#E74C3C'
    },
  ];

  const handleLogout = async (): Promise<void> => {
    try {
      // Dispatch logout action
      await dispatch(logoutUser()).unwrap();
      
      console.log('User logged out successfully');
      
      // Close drawer
      props.navigation.closeDrawer();
      
      // Navigate to login screen
      router.replace('/Onboarding/Login');
      
    } catch (error) {
      console.error('Error during logout:', error);
      
      // Even if there's an error, still navigate to login
      Alert.alert(
        'Logout',
        'You have been logged out',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/Onboarding/Login')
          }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollView}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color="#fff" />
          </View>
          <Text style={styles.userName}>
            {user ? `${user.name}` : 'Guest User'}
          </Text>
          <Text style={styles.userEmail}>
            {user?.email || 'guest@example.com'}
          </Text>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => {
                router.push(item.route as any);
                props.navigation.closeDrawer();
              }}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon} size={24} color={item.color} />
              </View>
              <Text style={styles.menuText}>{item.name}</Text>
              <Ionicons name="chevron-forward" size={20} color="#BDC3C7" />
            </TouchableOpacity>
          ))}
        </View>
      </DrawerContentScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#E74C3C" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    paddingTop: 0,
  },
  profileSection: {
    backgroundColor: '#4A90E2',
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#357ABD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: '#E8F0FE',
  },
  menuSection: {
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ECF0F1',
    backgroundColor: '#FFF5F5',
  },
  logoutText: {
    fontSize: 16,
    color: '#E74C3C',
    marginLeft: 15,
    fontWeight: '600',
  },
});

export default CustomDrawer;