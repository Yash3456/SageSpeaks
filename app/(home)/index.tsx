// App.tsx
import { RootDrawerParamList } from '@/lib/store/types/TYpe';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import CustomDrawer from './CustomDrawer';
import AnalyticsScreen from './DrawerScreens/AnalyticsScrern';
import NotificationsScreen from './DrawerScreens/NotificationScreen';
import ProfileScreen from './DrawerScreens/ProfileScreen';
import SettingsScreen from './DrawerScreens/SettingsScreen';
import SupportScreen from './DrawerScreens/SupportScreen';
import HomeScreen from './HomeScreen';

const Drawer = createDrawerNavigator<RootDrawerParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={{
          headerShown: false,
          drawerType: 'slide',
          overlayColor: 'rgba(0,0,0,0.5)',
          drawerStyle: {
            width: 280,
          },
        }}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
        <Drawer.Screen name="Analytics" component={AnalyticsScreen} />
        <Drawer.Screen name="Support" component={SupportScreen} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;