// CustomDrawer.tsx
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface MenuItem {
  name: string;
  icon: IoniconsName;
  route: keyof RootDrawerParamList;
  color: string;
}

import { RootDrawerParamList } from '@/lib/store/types/TYpe';

const CustomDrawer: React.FC<DrawerContentComponentProps> = (props) => {
  const menuItems: MenuItem[] = [
    { 
      name: 'Home', 
      icon: 'home-outline',
      route: 'Home',
      color: '#4A90E2'
    },
    { 
      name: 'Profile', 
      icon: 'person-outline',
      route: 'Profile',
      color: '#50C878'
    },
    { 
      name: 'Settings', 
      icon: 'settings-outline',
      route: 'Settings',
      color: '#FFA500'
    },
    { 
      name: 'Analytics', 
      icon: 'bar-chart-outline',
      route: 'Analytics',
      color: '#9B59B6'
    },
    { 
      name: 'Help & Support', 
      icon: 'help-circle-outline',
      route: 'Support',
      color: '#E74C3C'
    },
  ];

  const handleLogout = (): void => {
    // Add your logout logic here
    console.log('Logout pressed');
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollView}>
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color="#fff" />
          </View>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userEmail}>john.doe@example.com</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => props.navigation.navigate(item.route)}
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

      {/* Logout Button */}
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