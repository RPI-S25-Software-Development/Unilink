import { View } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native-virtualized-view";

import "@/global.css";

import DropdownMultiSelect, { DropdownSelectedItemsState } from "@/components/DropdownMultiSelect";
import EventTag from "@/components/EventTag";
import RoundedBox from "@/components/RoundedBox";
import HeaderText from "@/components/HeaderText";
import MedButton from "@/components/MedButton";

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

type TagsData = Map<string, {
  name: string;
  category: string;
  color: string;
}>;

type TagDataAPI = {
  tagId: string;
  tagName: string;
  tagCategory: string;
  tagColor: string;
};

function getTagsWithCategory(category: string, allTagsData: TagsData) {
  return new Map(
    [...allTagsData.entries()].filter(([key, item]) => item.category === category)
  );
};

function addTagAPIDataToTagsData(tagsAPIData: TagDataAPI[], allTagsData: TagsData) {
  for(var tagAPIData of tagsAPIData) {
    if(!allTagsData.has(tagAPIData.tagId)) {
      allTagsData.set(tagAPIData.tagId, {
        name: tagAPIData.tagName,
        category: tagAPIData.tagCategory,
        color: tagAPIData.tagColor
      });
    }
  };
};

function createTagComponents(tagsData: TagsData) {
  var result = [];
  
  for(var [tagId, tagData] of tagsData) {
    result.push(<EventTag key={tagId} name={tagData.name} backgroundColor={tagData.color}/>)
  }

  return result;
};

function dropdownItemsFromKeys(keys: string[]) {
  var result = [];

  for(var key of keys) {
    result.push({key: key});
  }

  return result;
};

function createTagsDropdown(tagCategory: string, allTagsData: TagsData,
selectedItemsState: DropdownSelectedItemsState) {
  return (
    <DropdownMultiSelect width={350}
    dropdownItems={
      dropdownItemsFromKeys(Array.from(getTagsWithCategory(tagCategory, allTagsData).keys()))
    }
    selectedItemsState={selectedItemsState}
    noItemsSelectedText={"Choose your " + tagCategory + " Interests"}
    itemsSelectedText={tagCategory + " Interests"}/>
  );
}

const getUserID = async () => {
  return await AsyncStorage.getItem("user_id");
}

const getTags = async() => {
  const response = await axios.get("http://localhost:3000/tags/");
  return response.data;
};

export default function PreferencesScreen() {
  const [userID, setUserID] = useState<string | null>(null);

  var allTags: TagsData = new Map();

  const [selectedAcademicTags, selectAcademicTags] = useState<string[]>([]);
  const [selectedSportsTags, selectSportsTags] = useState<string[]>([]);
  const [selectedClubTags, selectClubTags] = useState<string[]>([]);
  const [selectedCareerTags, selectCareerTags] = useState<string[]>([]);

  useEffect(() => {
    getUserID().then((response) => {
      setUserID(userID);
      console.log(`User ID: ${response}`);
      if(!response) router.navigate("/login");
    })
  });

  // getTags().then(result => {
  //   addTagAPIDataToTagsData(result, allTags);
  // });

  const router = useRouter();

  return (
    <ScrollView>
      <HeaderText fontSize={48} className="m-10">Manage Your Preferences</HeaderText>
      <HeaderText fontSize={32}>Your Tags of Interest</HeaderText>
      <RoundedBox width="90%" height="auto" className="mx-auto my-5 flex flex-row flex-wrap justify-center">
        {/* {getTagsFromDropdownItems(academicItems, AcademicTagColor)}
        {getTagsFromDropdownItems(sportsItems, SportsTagColor)}
        {getTagsFromDropdownItems(clubItems, ClubsTagColor)}
        {getTagsFromDropdownItems(careerItems, CareerTagColor)} */}
      </RoundedBox>
      <View className="my-10 flex flex-col gap-10 items-center">
        {createTagsDropdown("Academic", allTags, {
          selectedItems: selectedAcademicTags,
          setSelectedItems: selectAcademicTags
        })}

        {createTagsDropdown("Sports", allTags, {
          selectedItems: selectedSportsTags,
          setSelectedItems: selectSportsTags
        })}

        {createTagsDropdown("Club", allTags, {
          selectedItems: selectedClubTags,
          setSelectedItems: selectClubTags
        })}

        {createTagsDropdown("Career", allTags, {
          selectedItems: selectedCareerTags,
          setSelectedItems: selectCareerTags
        })}

        <MedButton label="Save" backgroundColor="#B61601" textColor="white"
        scale={1.5} onPress={() => router.navigate("/home")}/>
      </View>
    </ScrollView>
  );
}