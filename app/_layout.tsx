import SimpleSplash from '@/components/SplashScreen';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import StoreProvider from '@/lib/store/StoreProvider';

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

  // Show custom splash screen while fonts are loading or custom splash is active
  if (!loaded || showCustomSplash) {
    return loaded ? (
      <SimpleSplash onFinish={() => setShowCustomSplash(false)} />
    ) : null;
  }


  return (
    <StoreProvider> 
    {/* only storing cache in android only not in web */}
      <AppWithAuth />  
    </StoreProvider>
  );
}


function AppWithAuth() {
  const colorScheme = useColorScheme();
  
  // Now we can safely use Redux hooks
  const { useAppDispatch, useAppSelector } = require('@/lib/store/hook');
  const { loadStoredAuth, selectIsAuthenticated, selectIsLoading } = require('@/lib/store/slices/UserSlice');
  
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await dispatch(loadStoredAuth()).unwrap();
      } catch (error) {
        console.log('Auth initialization error:', error);
      } finally {
        setAuthInitialized(true);
      }
    };

    initializeAuth();
  }, [dispatch]);

  // Show splash while checking authentication
  if (!authInitialized || isLoading) {
    return <SimpleSplash onFinish={() => {}} />; // Don't finish until auth is ready
  }

  // Now render the appropriate navigation based on auth state
  return (
    <ThemeProvider value={DefaultTheme}>
      {isAuthenticated ? <AuthenticatedLayout /> : <UnauthenticatedLayout />}
    </ThemeProvider>
  );
}

function AuthenticatedLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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