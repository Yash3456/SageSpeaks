// types.ts
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RouteProp } from '@react-navigation/native';

export type RootDrawerParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
  Analytics: undefined;
  Support: undefined;
  Notifications: undefined;
};

export type HomeScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'Home'>;
export type HomeScreenRouteProp = RouteProp<RootDrawerParamList, 'Home'>;

export interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
}