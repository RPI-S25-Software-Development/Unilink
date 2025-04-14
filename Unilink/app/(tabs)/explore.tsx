import { ScrollView, View, TextInput } from "react-native";
import "@/global.css";
import { FontAwesome } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import RoundedBox from "@/components/RoundedBox";
import MedButton from "@/components/MedButton";
import HeaderText from "@/components/HeaderText";
import EventsList from "@/components/EventsList";
import { selectButtonsState, getFromStorage } from "../_layout";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Redirect } from "expo-router";

export default function ExploreScreen() {
  const [userId, setUserId] = useState<string>();
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [searchText, setSearchText] = useState<string>();

  var content = <LoadingSpinner scale={2} margin="5%"/>;
  
  useEffect(() => {
    const getUserId = async () => {
      const userIdResponse = await getFromStorage("user_id");
      if(userIdResponse) setUserId(userIdResponse);
    };

    getUserId();
  }, []);

  if(userId) {
    if(userId === null) return <Redirect href="/login"/>;
    content =
    <View className="items-center py-4">
      <RoundedBox width={350} height="auto" className="my-3 py-2 px-4 flex flex-row items-center">
        <FontAwesome name="search" size={16} color="black" className="mr-4"/>
        <TextInput style={{width: "100%", padding: 0, fontSize:16, outline: "none"}}
        onSubmitEditing={(data) => {setSearchText(data.nativeEvent.text)}}/>
      </RoundedBox>
      <View className="my-3">
        <HeaderText fontSize={24}>Explore by Category</HeaderText>
        <ScrollView horizontal style={{maxHeight: 75}}>
          <View className="flex flex-row px-5">
            <MedButton label="Academic" scale={0.9} baseFontSize={16}
              onPress={() => selectButtonsState(setSelectedCategory, "academics")}
              backgroundColor={selectedCategory === "academics" ? "lightgray" : "white"}/>
            <MedButton label="Sports" scale={0.9} baseFontSize={16}
              onPress={() => selectButtonsState(setSelectedCategory, "sports")}
              backgroundColor={selectedCategory === "sports" ? "lightgray" : "white"}/>
            <MedButton label="Club" scale={0.9} baseFontSize={16}
              onPress={() => selectButtonsState(setSelectedCategory, "clubs")}
              backgroundColor={selectedCategory === "clubs" ? "lightgray" : "white"}/>
            <MedButton label="Career" scale={0.9} baseFontSize={16}
            onPress={() => selectButtonsState(setSelectedCategory, "career")}
              backgroundColor={selectedCategory === "career" ? "lightgray" : "white"}/>
          </View>
        </ScrollView>
      </View>
      <EventsList eventsAPIRoute={"/events/userId/" + userId} userId={userId}
      filterOptions={{tagCategory: selectedCategory, searchTitle: searchText}}/>
    </View>
  }

  return (
      <ScrollView className="flex-1">
        {content}
      </ScrollView>
    );
}
