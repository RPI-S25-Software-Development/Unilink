import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from 'react';
import { View } from "react-native";
import { StatusBar } from 'expo-status-bar';

import Banner from "@/components/Banner";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Inter': require('@/assets/fonts/Inter-VariableFont_opsz,wght.ttf')
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={{flex: 1}}>
      <Banner backgroundColor="#DC0000" titleColor="#FFFFFF" title="RPI Unilink"
            titleFontFamily="Inter" titleFontWeight="bold"/>
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
        <Stack.Screen name="+not-found" options={{headerShown: false}}/>
      </Stack>
      <StatusBar/>
    </View>
  );
}