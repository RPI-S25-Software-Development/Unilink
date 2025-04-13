import { View, ScrollView } from "react-native";
import MedButton from "@/components/MedButton";
import EventsList from "@/components/EventsList";
import { getFromStorage, selectButtonsState } from "../_layout";
import { useState, useEffect } from "react";
import { Redirect } from "expo-router";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function HomeScreen() {
  const [userId, setUserId] = useState<string>();
  const [eventView, setEventView] = useState<string>();

  var content = <LoadingSpinner scale={2} margin="5%"/>;

  useEffect(() => {
    const getUserId = async () => {
      const userIdResponse = await getFromStorage("user_id");
      if(userIdResponse) setUserId(userIdResponse);
    };

    getUserId();
  }, []);

  var filterOptions = {};
  if(eventView === "user") filterOptions = {userSaved: true};

  if(userId) {
    if(userId === null) return <Redirect href="/login"/>;
    content =
    <View className="items-center py-4">
      <View className="flex flex-row">
        <MedButton label="Trending"
        onPress={() => {selectButtonsState(setEventView, "trending")}}
        backgroundColor={eventView === "trending" ? "lightgray" : "white"}/>
        <MedButton label="My Events"
        onPress={() => {selectButtonsState(setEventView, "user")}}
        backgroundColor={eventView === "user" ? "lightgray" : "white"}/>
      </View>
      <EventsList eventsAPIRoute={"/events/userId/" + userId} userId={userId} filterOptions={filterOptions}/>
    </View>
  };

  return (
    <ScrollView className="flex-1">
      {content}
    </ScrollView>
  );
}
