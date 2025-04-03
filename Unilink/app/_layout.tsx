import { Stack, Link } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from 'react';
import { View, Text } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { AntDesign } from '@expo/vector-icons';

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
      <Banner backgroundColor="#DC0000">
        <View className="flex flex-row justify-between items-end">
          <Link href="/home" className="w-fit">
            <Text style={{
                color: "#FFFFFF",
                fontSize: 20,
                fontFamily: "Inter",
                fontWeight: "bold",
            }}>RPI Unilink</Text>
          </Link>
          <Link href="/preferences"
          style={{borderColor: "white", borderWidth: 2, borderRadius: 32, padding: 6,
          //backgroundColor: "rgba(255,255,255,0.5)"
          }}>
            <AntDesign name="user" size={24} color="white"/>
          </Link>
        </View>
      </Banner>
      <Stack screenOptions={{headerShown: false, contentStyle: {backgroundColor: "white"}}}>
        <Stack.Screen  name="(tabs)" options={{headerShown: false}}/>
        <Stack.Screen name="preferences" options={{headerShown: false}}/>
        <Stack.Screen name="+not-found" options={{headerShown: false}}/>
      </Stack>
      <StatusBar/>
    </View>
  );
}