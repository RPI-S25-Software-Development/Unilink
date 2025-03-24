import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffd33d",
        headerStyle: {
          backgroundColor: "#25292e"
        },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#25292e"
        }
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home", 
          // tabBarIcon: ({color, focused}) => (
          //   <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24}/>
          // )
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore", 
          // tabBarIcon: ({color, focused}) => (
          //   <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24}/>
          // )
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map", 
          // tabBarIcon: ({color, focused}) => (
          //   <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24}/>
          // )
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar", 
          // tabBarIcon: ({color, focused}) => (
          //   <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24}/>
          // )
        }}
      />
    </Tabs>
  );
}
