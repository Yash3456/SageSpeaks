import { useAppDispatch, useAppSelector } from '@/lib/store/hook';
import { clearError, loginUser, selectError, selectIsLoading } from '@/lib/store/slices/UserSlice';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  const handleLogin = async () => {
    dispatch(clearError());
    
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      // Navigation will be handled by your auth flow
    } catch (error) {
      Alert.alert('Login Failed', error as string);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TouchableOpacity
        onPress={handleLogin}
        disabled={isLoading}
        style={{ backgroundColor: '#667eea', padding: 15, alignItems: 'center' }}
      >
        <Text style={{ color: 'white' }}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>
      {error && <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text>}
    </View>
  );
}