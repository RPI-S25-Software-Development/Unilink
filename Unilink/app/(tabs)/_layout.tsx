import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { View } from "react-native";
import { StatusBar } from 'expo-status-bar';

import Banner from "@/components/Banner";

export default function Layout() {
  return (
    <View style={{flex: 1}}>
      <Banner backgroundColor="#DC0000" titleColor="#FFFFFF" title="RPI Unilink"
      titleFontFamily="Inter" titleFontWeight="bold"/>
      <Tabs screenOptions={{
        tabBarActiveBackgroundColor: "#cccccc",
        tabBarInactiveBackgroundColor: "#f2f2f2",
        tabBarActiveTintColor: "#767676",
        tabBarInactiveTintColor: "#767676",
        headerShown: false
      }}>
        <Tabs.Screen name="home" options={{
          title: "Home",
          tabBarIcon: ({color}) => <AntDesign name="home" size={24} color={color} />
        }}/>
        <Tabs.Screen name="explore" options={{
          title: "Explore",
          tabBarIcon: ({color}) => <Entypo name="magnifying-glass" size={24} color={color} />
        }}/>
        <Tabs.Screen name="map" options={{
          title: "Map",
          tabBarIcon: ({color}) => <FontAwesome name="map-marker" size={24} color={color} />
        }}/>
        <Tabs.Screen name="calendar" options={{
          title: "Calendar",
          tabBarIcon: ({color}) => <FontAwesome name="calendar" size={24} color={color} />
        }}/>
        <Tabs.Screen name="index" options={{title: "Index", href:null}}/>
      </Tabs>
      <StatusBar/>
    </View>
  );
}