import { View } from "react-native";
import { useState, useEffect } from "react";
import { useRouter, Redirect } from "expo-router";
import { ScrollView } from "react-native-virtualized-view";

import "@/global.css";

import DropdownMultiSelect, { DropdownSelectedItemsState } from "@/components/DropdownMultiSelect";
import EventTag from "@/components/EventTag";
import RoundedBox from "@/components/RoundedBox";
import HeaderText from "@/components/HeaderText";
import MedButton from "@/components/MedButton";
import LoadingSpinner from "@/components/LoadingSpinner";

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

type TagsData = Map<string, {
  name: string;
  category: string;
  color: string;
}>;

type TagDataAPI = {
  tag_id: string;
  tag_name: string;
  classification: string;
  color: string;
};

function getTagNames(tagsData?: TagsData, category?: string) {
  var result = [];
  
  if(tagsData) {
    for(var [tagKey, tagData] of tagsData) {
      if(!category || (category && tagData.category === category))
        result.push(tagData.name);
    }
  }

  return result;
};

function tagsAPIDataToMap(tagsAPIData: TagDataAPI[]) {
  var result: TagsData = new Map();

  for(var tagAPIData of tagsAPIData) {
    if(!result.has(tagAPIData.tag_id)) {
      result.set(tagAPIData.tag_id, {
        name: tagAPIData.tag_name,
        category: tagAPIData.classification,
        color: tagAPIData.color
      });
    }
  };

  return result;
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

function createTagsDropdown(tagsData: TagsData | undefined, interestsText: string,
selectedItemsState: DropdownSelectedItemsState, tagCategory?: string) {
  return (
    <DropdownMultiSelect width={350}
    dropdownItems={
      dropdownItemsFromKeys(getTagNames(tagsData, tagCategory))
    }
    selectedItemsState={selectedItemsState}
    noItemsSelectedText={"Choose your " + interestsText + " Interests"}
    itemsSelectedText={interestsText + " Interests"}/>
  );
}

const getUserID = async () => {
  const userID = await AsyncStorage.getItem("user_id");
  console.log("User ID: " + userID);
  return userID;
}

const getTags = async() => {
  const response = await axios.get("http://localhost:3000/tags/");
  console.log(response);
  return response.data;
};

export default function PreferencesScreen() {
  const router = useRouter();

  const [userID, setUserID] = useState<string | null>(null);

  const [allTags, setAllTags] = useState<TagsData>();

  const [selectedAcademicTags, selectAcademicTags] = useState<string[]>([]);
  const [selectedSportsTags, selectSportsTags] = useState<string[]>([]);
  const [selectedClubTags, selectClubTags] = useState<string[]>([]);
  const [selectedCareerTags, selectCareerTags] = useState<string[]>([]);

  var content: JSX.Element | null = null;

  useEffect(() => {
    if(!userID) {
      getUserID().then((response) => {
        setUserID(response);
      });
    } else if(!allTags) {
      getTags().then((response) => {
        setAllTags(tagsAPIDataToMap(response));
      });
    };
  });

  if(userID) {
    if(allTags) {
      content =
        <View>
          <HeaderText fontSize={32}>Your Tags of Interest</HeaderText>
          <RoundedBox width="90%" height="auto" className="mx-auto my-5 flex flex-row flex-wrap justify-center">
            {/* {getTagsFromDropdownItems(academicItems, AcademicTagColor)}
            {getTagsFromDropdownItems(sportsItems, SportsTagColor)}
            {getTagsFromDropdownItems(clubItems, ClubsTagColor)}
            {getTagsFromDropdownItems(careerItems, CareerTagColor)} */}
          </RoundedBox>
          <View className="my-10 flex flex-col gap-10 items-center">
            {createTagsDropdown(allTags, "Academic", {
              selectedItems: selectedAcademicTags,
              setSelectedItems: selectAcademicTags
            }, "academics")}

            {createTagsDropdown(allTags, "Sports", {
              selectedItems: selectedSportsTags,
              setSelectedItems: selectSportsTags
            }, "sports")}

            {createTagsDropdown(allTags, "Club", {
              selectedItems: selectedClubTags,
              setSelectedItems: selectClubTags
            }, "clubs")}

            {createTagsDropdown(allTags, "Career", {
              selectedItems: selectedCareerTags,
              setSelectedItems: selectCareerTags
            }, "career")}

            <MedButton label="Save" backgroundColor="#B61601" textColor="white"
            scale={1.5} onPress={() => router.navigate("/home")}/>
          </View>
        </View>;
    } else {
      content = <LoadingSpinner scale={2} margin="5%"/>;
    }
  } else {
    return <Redirect href="/login"/>;
  };

  return <ScrollView>
    <HeaderText fontSize={48} className="m-10">Manage Your Preferences</HeaderText>
    {content}
  </ScrollView>;
}