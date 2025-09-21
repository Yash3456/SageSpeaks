import { router } from 'expo-router';
import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import * as Animatable from 'react-native-animatable';

export default function Launch() {
  const backgroundRef = useRef<any>(null);
  const logoRef = useRef<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (backgroundRef.current && logoRef.current) {
        Promise.all([
          backgroundRef.current.fadeOut(500),
          logoRef.current.fadeOut(500)
        ]).then(() => {
          router.replace('/');
        });
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1">
      <Animatable.Image
        animation="fadeIn"
        duration={1000}
        source={require('../assets/images/launch-bg.png')}
        className="w-full h-full"
        style={{ resizeMode: 'cover' }}
        ref={backgroundRef}
      />
      <View className="absolute inset-0 justify-center items-center">
        <Animatable.Image
          animation="zoomIn"
          duration={4000}
          source={require('../assets/images/ezi.png')}
          style={{ 
            width: 300, 
            height: 200, 
            resizeMode: 'contain'
          }}
          ref={logoRef}
        />
      </View>
    </View>
  );
}