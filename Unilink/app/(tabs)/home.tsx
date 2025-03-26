import { Text, View, ScrollView } from "react-native";
import EventBox from "@/components/EventBox";
import MedButton from "@/components/MedButton";

import "@/global.css";

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1">
      <View className="items-center py-4">
        <View className="flex flex-row">
          <MedButton label="Trending"/>
          <MedButton label="My Events"/>
        </View>
        <EventBox />
        <EventBox />
        <EventBox />
        <EventBox />
        <EventBox />
      </View>
    </ScrollView>
  );
}
