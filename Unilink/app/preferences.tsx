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
  id: string;
  category: string;
  color: string;
}>;

type TagDataAPI = {
  tag_id: string;
  tag_name: string;
  classification: string;
  color: string;
};

function getTagIds(tagsData?: TagsData) {
  var result = [];

  if(tagsData) {
    for(var [tagName, tagData] of tagsData) {
      result.push(tagData.id);
    }
  }

  return result;
}

function getTagNamesByCategory(category: string, tagsData?: TagsData) {
  var result = [];
  
  if(tagsData) {
    for(var [tagName, tagData] of tagsData) {
      if(tagData.category === category) result.push(tagName);
    }
  }

  return result;
};

function tagsAPIDataToMap(tagsAPIData: TagDataAPI[]) {
  var result: TagsData = new Map();

  for(var tagAPIData of tagsAPIData) {
    if(!result.has(tagAPIData.tag_id)) {
      result.set(tagAPIData.tag_name, {
        id: tagAPIData.tag_id,
        category: tagAPIData.classification,
        color: tagAPIData.color
      });
    }
  };

  return result;
};

function createTagComponents(tagNames: string[], tagsData?: TagsData) {
  var result = [];
  
  if(tagsData) {
    for(var tagName of tagNames) {
      var tagData = tagsData.get(tagName);
      if(tagData) {
        result.push(<EventTag key={tagData.id} name={tagName} backgroundColor={tagData.color}/>);
      }
    }
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
selectedItemsState: DropdownSelectedItemsState) {
  return (
    <DropdownMultiSelect width={350}
    dropdownItems={
      dropdownItemsFromKeys(tagsData ? Array.from(tagsData?.keys()) : [])
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

const getTagsByCategory = async(category: string) => {
  const response = await axios.get("http://localhost:3000/tags/classification/" + category);
  console.log(response);
  return response.data;
}

export default function PreferencesScreen() {
  const router = useRouter();

  const [userID, setUserID] = useState<string | null>(null);

  const [allTags, setAllTags] = useState<boolean>(false);

  const [academicTags, setAcademicTags] = useState<TagsData>();
  const [sportsTags, setSportsTags] = useState<TagsData>();
  const [clubTags, setClubTags] = useState<TagsData>();
  const [careerTags, setCareerTags] = useState<TagsData>();

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
      getTagsByCategory("academics").then((response) => {
        setAcademicTags(tagsAPIDataToMap(response));
      })

      getTagsByCategory("sports").then((response) => {
        setSportsTags(tagsAPIDataToMap(response));
      })

      getTagsByCategory("clubs").then((response) => {
        setClubTags(tagsAPIDataToMap(response));
      })

      getTagsByCategory("career").then((response) => {
        setCareerTags(tagsAPIDataToMap(response));
      })

      setAllTags(true);
    }
  });

  if(userID) {
    if(allTags) {
      content =
        <View>
          <HeaderText fontSize={32}>Your Tags of Interest</HeaderText>
          <RoundedBox width="90%" height="auto" className="mx-auto my-5 flex flex-row flex-wrap justify-center">
            {createTagComponents(selectedAcademicTags, academicTags)}
            {createTagComponents(selectedSportsTags, sportsTags)}
            {createTagComponents(selectedClubTags, clubTags)}
            {createTagComponents(selectedCareerTags, careerTags)}
          </RoundedBox>
          <View className="my-10 flex flex-col gap-10 items-center">
            {createTagsDropdown(academicTags, "Academic", {
              selectedItems: selectedAcademicTags,
              setSelectedItems: selectAcademicTags
            })}

            {createTagsDropdown(sportsTags, "Sports", {
              selectedItems: selectedSportsTags,
              setSelectedItems: selectSportsTags
            })}

            {createTagsDropdown(clubTags, "Club", {
              selectedItems: selectedClubTags,
              setSelectedItems: selectClubTags
            })}

            {createTagsDropdown(careerTags, "Career", {
              selectedItems: selectedCareerTags,
              setSelectedItems: selectCareerTags
            })}

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