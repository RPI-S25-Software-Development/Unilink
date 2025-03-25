import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{title: "Home"}}/>
      <Tabs.Screen name="explore" options={{title: "Explore"}}/>
      <Tabs.Screen name="map" options={{title: "Map"}}/>
      <Tabs.Screen name="calendar" options={{title: "Calendar"}}/>
      <Tabs.Screen name="index" options={{title: "Index", href:null}}/>
    </Tabs>
  );
}