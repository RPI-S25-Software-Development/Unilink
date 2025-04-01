import { Text, View, ScrollView } from "react-native";
import { useState } from "react";
import { Link } from "expo-router";

import "@/global.css";

import PlusButton from "@/components/PlusButton";
import Dropdown from "@/components/Dropdown";
import EventTag from "@/components/EventTag";
import IconOption from "@/components/IconOption";
import RoundedBox from "@/components/RoundedBox";
import HeaderText from "@/components/HeaderText";

export default function ProfileScreen() {
  const currentYear = new Date().getFullYear();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const disableNotifications = () => {
    setNotificationsEnabled(false);
  };

  const enableNotifications = () => {
    setNotificationsEnabled(true);
  };

  return (
    <ScrollView>
      <HeaderText fontSize={48} className="m-10">Manage Your Preferences</HeaderText>
      <HeaderText fontSize={32}>Your Tags of Interest</HeaderText>
      <RoundedBox width="90%" height="auto" className="mx-auto my-5 flex flex-row flex-wrap justify-center">
        <EventTag backgroundColor="#FF8F8F" name="Academic"/>
        <EventTag backgroundColor="#8FC9FF" name="Clubs"/>
        <EventTag backgroundColor="#FFBC8F" name="Career"/>
      </RoundedBox>
      <View className="m-10">
        <HeaderText fontSize={20} centerText={false} className="pb-5">
          Choose your Academic Interests:
        </HeaderText>
        <Dropdown dropdownItems={[
          {key: "academic-1", label: "Academic 1"},
          {key: "academic-2", label: "Academic 2"},
          {key: "academic-3", label: "Academic 3"},
          {key: "academic-4", label: "Academic 4"},
          {key: "academic-5", label: "Academic 5"}
        ]}/>
      </View>
    </ScrollView>
  );
}