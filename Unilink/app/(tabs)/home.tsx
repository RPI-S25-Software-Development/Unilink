import { View, ScrollView } from "react-native";
import MedButton from "@/components/MedButton";
import EventsList from "@/components/EventsList";
import { getUserId, selectButtonsState } from "../_layout";
import { useState, useEffect } from "react";

export default function HomeScreen() {
  const [userId, setUserId] = useState<string>();
  const [eventView, setEventView] = useState<string>();

  var eventsAPIRoute = "http://localhost:3000/events/";

  switch(eventView) {
    case "trending":
      eventsAPIRoute = "http://localhost:3000/events/";
      break;
    case "user":
      eventsAPIRoute = "http://localhost:3000/events/userId/" + userId;
      break;
  }

  useEffect(() => {
    getUserId().then((userIdResponse) => {
      if(userIdResponse) setUserId(userIdResponse);
    });
  }, []);

  return (
    <ScrollView className="flex-1">
      <View className="items-center py-4">
        <View className="flex flex-row">
          <MedButton label="Trending"
          onPress={() => {selectButtonsState(setEventView, "trending")}}
          backgroundColor={eventView === "trending" ? "lightgray" : "white"}/>
          <MedButton label="My Events"
          onPress={() => {selectButtonsState(setEventView, "user")}}
          backgroundColor={eventView === "user" ? "lightgray" : "white"}/>
        </View>
        <EventsList eventsAPIRoute={eventsAPIRoute}/>
      </View>
    </ScrollView>
  );
}
