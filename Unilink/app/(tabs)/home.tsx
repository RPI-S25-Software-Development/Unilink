import { View, ScrollView } from "react-native";

import "@/global.css";

import EventBox from "@/components/EventBox";
import MedButton from "@/components/MedButton";

export default function HomeScreen() {
  const PlaceholderImage = require('@/assets/images/LitterBug.png');
  const EventTitle = "@SSTF";
  const EventDescription = "Join us for the Litter Bug Battle!";
  const PlaceHolderEvent = <EventBox
    imageSource={PlaceholderImage}
    eventText={{
      tags: [
        { backgroundColor: "#8FC9FF", name: "Clubs & Organizations" },
        { backgroundColor: "#9FEA8E", name: "Volunteering" },
        { backgroundColor: "#C98FFF", name: "Social Gatherings" }
      ],
      title: EventTitle, description: EventDescription,
      details: [
        { key: "location", iconSource: {evilIconName: "location"}, text: "'87 Gym" },
        { key: "time", iconSource: {evilIconName: "clock"}, text: "Oct 27, 12-4" }
      ]
    }}
  />

  return (
    <ScrollView className="flex-1">
      <View className="items-center py-4">
        <View className="flex flex-row">
          <MedButton label="Trending"/>
          <MedButton label="My Events"/>
        </View>
        {PlaceHolderEvent}
        {PlaceHolderEvent}
        {PlaceHolderEvent}
        {PlaceHolderEvent}
        {PlaceHolderEvent}
      </View>
    </ScrollView>
  );
}
