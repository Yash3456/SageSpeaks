import SimpleSplash from '@/components/SplashScreen';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';

import CheckingDetails from '@/components/DetailsChecking';
import { useColorScheme } from '@/components/useColorScheme';
import StoreProvider from '@/lib/store/StoreProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  
  const [showCustomSplash, setShowCustomSplash] = useState(true);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded || showCustomSplash) {
    return loaded ? (
      <SimpleSplash onFinish={() => setShowCustomSplash(false)} />
    ) : null;
  }


  return (
    <StoreProvider> 
      <AppWithAuth />  
    </StoreProvider>
  );
}


function AppWithAuth() {
  const colorScheme = useColorScheme();
  
  const { useAppDispatch, useAppSelector } = require('@/lib/store/hook');
  const { loadStoredAuth, selectIsAuthenticated, selectIsLoading } = require('@/lib/store/slices/UserSlice');
  
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const [user, accessToken, refreshToken] = await Promise.all([
          AsyncStorage.getItem('user'),
          AsyncStorage.getItem('accessToken'),
          AsyncStorage.getItem('refreshToken'),
        ]);

        if (user && accessToken && refreshToken) {
          await dispatch(loadStoredAuth()).unwrap();
          console.log('✅ Loaded stored authentication');
        } else {
          console.log('ℹ️ No stored credentials found — showing login screen');
        }
      } catch (error) {
        console.log('Auth initialization error:', error);
      } finally {
        setAuthInitialized(true);
      }
    };

    initializeAuth();
  }, [dispatch]);


  if (!authInitialized || isLoading) {
    return <CheckingDetails onFinish={() => {}} />;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      {isAuthenticated ? <AuthenticatedLayout /> : <UnauthenticatedLayout />}
    </ThemeProvider>
  );
}

function AuthenticatedLayout() {
  return (
    <Stack>
      <Stack.Screen name="(home)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}


function UnauthenticatedLayout() {
  return (
    <Stack initialRouteName='Onboarding/StepperInfo/Slide' screenOptions={{headerShown: false}}>
      <Stack.Screen name="Onboarding/Login" options={{ headerShown: false }} />
      <Stack.Screen name="Onboarding/StepperInfo/Slide" options={{ headerShown: false }} />
    </Stack>
  );
}