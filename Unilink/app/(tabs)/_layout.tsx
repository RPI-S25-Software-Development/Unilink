import { Tabs } from "expo-router";
import { AntDesign, Entypo, FontAwesome, Feather } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveBackgroundColor: "#cccccc",
      tabBarInactiveBackgroundColor: "#f2f2f2",
      tabBarActiveTintColor: "#767676",
      tabBarInactiveTintColor: "#767676",
      headerShown: false,
      sceneStyle: {backgroundColor: "white"}
    }}>
      <Tabs.Screen name="home" options={{
        title: "Home",
        tabBarIcon: ({color}) => <AntDesign name="home" size={24} color={color} />
      }}/>
      <Tabs.Screen name="explore" options={{
        title: "Explore",
        tabBarIcon: ({color}) => <Entypo name="magnifying-glass" size={24} color={color} />
      }}/>
      <Tabs.Screen name="notifications" options={{
        title: "Notifications",
        tabBarIcon: ({color}) => <Feather name="bell" size={24} color={color} />
      }}/>
      <Tabs.Screen name="calendar" options={{
        title: "Calendar",
        tabBarIcon: ({color}) => <FontAwesome name="calendar" size={24} color={color} />
      }}/>
      <Tabs.Screen name="index" options={{title: "Index", href:null}}/>
    </Tabs>
  );
}