import { Stack, Link } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from 'react';
import { View, Text } from "react-native";
import { StatusBar } from 'expo-status-bar';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import Banner from "@/components/Banner";

SplashScreen.preventAutoHideAsync();

function fullAPIRoute(APIRoute: string) {
  var host = process.env.EXPO_PUBLIC_API_HOST
  if(host === "PROD") host = process.env.EXPO_PUBLIC_ENV;
  if(host === "DEV") host = "localhost";

  return "http://" + host + ":" + process.env.EXPO_PUBLIC_API_PORT + APIRoute;
};

export async function getFromStorage(item: string, logResponse = false) {
  try {
    const itemValue = await AsyncStorage.getItem(item);
    if(logResponse) console.log("Item retrieved from storage: " + itemValue);
    return itemValue;
  } catch (error) {
    console.error("Error retrieving from storage:", error);
  }
};

export async function saveToStorage(item: string, itemValue: string,
getItemFromStorage = false, logResponse = false) {
  try {
    const response = await AsyncStorage.setItem(item, itemValue);
    if(logResponse) console.log("Item set in storage. Response: " + response);
    if(getItemFromStorage) {
      const itemFromStorage = await AsyncStorage.getItem(item);
      return itemFromStorage;
    }
  } catch (error) {
    console.error("Error setting item in storage:", error);
  }
}

export async function getAPI(APIRoute: string, logResponse = false) {
  try {
    const response = await axios.get(fullAPIRoute(APIRoute));
    if(logResponse) console.log(response);
    return response;
  } catch (error) {
    console.error("Error with GET API call:", error);
  }
};

export async function postAPI(APIRoute: string, requestBody?: {}, logResponse = false) {
  try {
    const response = await axios.post(fullAPIRoute(APIRoute), requestBody);
    if(logResponse) console.log(response);
    return response;
  } catch (error) {
    console.error("Error with POST API call:", error);
  }
};

export async function putAPI(APIRoute: string, requestBody?: {}, logResponse = false) {
  try {
    const response = axios.put(fullAPIRoute(APIRoute), requestBody);
    if(logResponse) console.log(response);
    return response;
  } catch (error) {
    console.error("Error with PUT API call:", error);
  }
};

export async function deleteAPI(APIRoute: string, logResponse = false) {
  try {
    const response = axios.delete(fullAPIRoute(APIRoute));
    if(logResponse) console.log(response);
    return response;
  } catch (error) {
    console.error("Error with DELETE API call:", error);
  }
};

export function selectButtonsState(
  setSelectedButton: React.Dispatch<React.SetStateAction<string | undefined>>,
  selected: string) {
  setSelectedButton((previousSelected) => previousSelected === selected ? undefined : selected);
};

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
        <Stack.Screen name="login" options={{headerShown: false}}/>
        <Stack.Screen name="signup" options={{headerShown: false}}/>
        <Stack.Screen name="+not-found" options={{headerShown: false}}/>
      </Stack>
      <StatusBar/>
    </View>
  );
}