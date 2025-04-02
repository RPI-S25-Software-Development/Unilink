import { View } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native-virtualized-view";

import "@/global.css";

import DropdownMultiSelect from "@/components/DropdownMultiSelect";
import EventTag from "@/components/EventTag";
import RoundedBox from "@/components/RoundedBox";
import HeaderText from "@/components/HeaderText";
import MedButton from "@/components/MedButton";

function getTagsFromDropdownItems(items: string[], tagColor: string) {
  var result = [];
  
    for(var item of items) {
      result.push(<EventTag key={item} backgroundColor={tagColor} name={item}/>)
    }

  return result;
};

export default function ProfileScreen() {
  const AcademicTagColor = "#FF8F8F";
  const SportsTagColor = "#0033cc";
  const ClubsTagColor = "#8FC9FF";
  const CareerTagColor = "#FFBC8F";

  const [academicItems, setAcademicItems] = useState<string[]>([]);
  const [sportsItems, setSportsItems] = useState<string[]>([]);
  const [clubItems, setClubItems] = useState<string[]>([]);
  const [careerItems, setCareerItems] = useState<string[]>([]);

  const router = useRouter();

  return (
    <ScrollView>
      <HeaderText fontSize={48} className="m-10">Manage Your Preferences</HeaderText>
      <HeaderText fontSize={32}>Your Tags of Interest</HeaderText>
      <RoundedBox width="90%" height="auto" className="mx-auto my-5 flex flex-row flex-wrap justify-center">
        {getTagsFromDropdownItems(academicItems, AcademicTagColor)}
        {getTagsFromDropdownItems(sportsItems, SportsTagColor)}
        {getTagsFromDropdownItems(clubItems, ClubsTagColor)}
        {getTagsFromDropdownItems(careerItems, CareerTagColor)}
      </RoundedBox>
      <View className="my-10 flex flex-col gap-10 items-center">
        <DropdownMultiSelect width={350} dropdownItems={[
          {key: "Academic 1"},
          {key: "Academic 2"},
          {key: "Academic 3"},
          {key: "Academic 4"},
          {key: "Academic 5"}
        ]} selectedItemsState={{selectedItems: academicItems, setSelectedItems: setAcademicItems}}
        noItemsSelectedText="Choose your Academic Interests" itemsSelectedText="Academic Interests"/>
        <DropdownMultiSelect width={350} dropdownItems={[
          {key: "Sports 1"},
          {key: "Sports 2"},
          {key: "Sports 3"},
          {key: "Sports 4"},
          {key: "Sports 5"}
        ]} selectedItemsState={{selectedItems: sportsItems, setSelectedItems: setSportsItems}}
        noItemsSelectedText="Choose your Sports Interests" itemsSelectedText="Sports Interests"/>
        <DropdownMultiSelect width={350} dropdownItems={[
          {key: "Club 1"},
          {key: "Club 2"},
          {key: "Club 3"},
          {key: "Club 4"},
          {key: "Club 5"}
        ]} selectedItemsState={{selectedItems: clubItems, setSelectedItems: setClubItems}}
        noItemsSelectedText="Choose your Club Interests" itemsSelectedText="Club Interests"/>
        <DropdownMultiSelect width={350} dropdownItems={[
          {key: "Career 1"},
          {key: "Career 2"},
          {key: "Career 3"},
          {key: "Career 4"},
          {key: "Career 5"}
        ]} selectedItemsState={{selectedItems: careerItems, setSelectedItems: setCareerItems}}
        noItemsSelectedText="Choose your Career Interests" itemsSelectedText="Career Interests"/>
        <MedButton label="Save" backgroundColor="#B61601" textColor="white"
        scale={1.5} onPress={() => router.navigate("/home")}/>
      </View>
    </ScrollView>
  );
}