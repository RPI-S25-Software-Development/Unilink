import { View, ScrollView } from "react-native";

import "@/global.css";

import EventBox from "@/components/EventBox";
import MedButton from "@/components/MedButton";

const PlaceholderImage = require('@/assets/images/LitterBug.png');
const EventTitle = "Litter Bug Battle";
const EventDescription = "Join us for the Litter Bug Battle!";
export const PlaceHolderEvent = <EventBox
  imageSource={PlaceholderImage}
  eventText={{
    tags: [
      { backgroundColor: "#8FC9FF", name: "Clubs & Organizations" },
      { backgroundColor: "#9FEA8E", name: "Volunteering" },
      { backgroundColor: "#C98FFF", name: "Social Gatherings" }
    ],
    title: EventTitle, description: EventDescription,
    details: [
      { key: "organization", iconSource: {evilIconName: "user"}, text: "SSTF"},
      { key: "location", iconSource: {evilIconName: "location"}, text: "'87 Gym" },
      { key: "time", iconSource: {evilIconName: "clock"}, text: "Oct 27, 12-4" }
    ]
  }}
  interactionCounts={{
    likeCount: 42,
    rsvpCount: 28
  }}
/>

export default function HomeScreen() {
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
