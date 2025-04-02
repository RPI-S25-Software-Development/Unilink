import { View } from "react-native";
import { useState } from "react";
import { Link } from "expo-router";
import { ScrollView } from 'react-native-virtualized-view';

import "@/global.css";

import PlusButton from "@/components/PlusButton";
import DropdownMultiSelect from "@/components/DropdownMultiSelect";
import EventTag from "@/components/EventTag";
import IconOption from "@/components/IconOption";
import RoundedBox from "@/components/RoundedBox";
import HeaderText from "@/components/HeaderText";
import MedButton from "@/components/MedButton";

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
      <View className="my-10 flex flex-col gap-10 items-center">
        <DropdownMultiSelect width={350} dropdownItems={[
          {key: "academic-1", label: "Academic 1"},
          {key: "academic-2", label: "Academic 2"},
          {key: "academic-3", label: "Academic 3"},
          {key: "academic-4", label: "Academic 4"},
          {key: "academic-5", label: "Academic 5"}
        ]} noItemsSelectedText="Choose your Academic Interests"
        itemsSelectedText="Academic Interests"/>
        <DropdownMultiSelect width={350} dropdownItems={[
          {key: "sports-1", label: "Sports 1"},
          {key: "sports-2", label: "Sports 2"},
          {key: "sports-3", label: "Sports 3"},
          {key: "sports-4", label: "Sports 4"},
          {key: "sports-5", label: "Sports 5"}
        ]} noItemsSelectedText="Choose your Sports Interests"
        itemsSelectedText="Sports Interests"/>
        <DropdownMultiSelect width={350} dropdownItems={[
          {key: "club-1", label: "Club 1"},
          {key: "club-2", label: "Club 2"},
          {key: "club-3", label: "Club 3"},
          {key: "club-4", label: "Club 4"},
          {key: "club-5", label: "Club 5"}
        ]} noItemsSelectedText="Choose your Club Interests"
        itemsSelectedText="Club Interests"/>
        <DropdownMultiSelect width={350} dropdownItems={[
          {key: "career-1", label: "Career 1"},
          {key: "career-2", label: "Career 2"},
          {key: "career-3", label: "Career 3"},
          {key: "career-4", label: "Career 4"},
          {key: "career-5", label: "Career 5"}
        ]} noItemsSelectedText="Choose your Career Interests"
        itemsSelectedText="Career Interests"/>
        <Link href="/home">
          <MedButton label="Save Your Preferences" backgroundColor="#B61601" textColor="white"
          scale={1.4}/>
        </Link>
      </View>
    </ScrollView>
  );
}