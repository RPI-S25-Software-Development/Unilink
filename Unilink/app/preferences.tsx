import { View, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useRouter, Router, Redirect } from "expo-router";
import { ScrollView } from "react-native-virtualized-view";
import { getUserId, getAPIData } from "./_layout";

import "@/global.css";

import DropdownMultiSelect, { DropdownSelectedItemsState } from "@/components/DropdownMultiSelect";
import EventTag from "@/components/EventTag";
import RoundedBox from "@/components/RoundedBox";
import HeaderText from "@/components/HeaderText";
import MedButton from "@/components/MedButton";
import LoadingSpinner from "@/components/LoadingSpinner";

import axios from "axios";

type TagData = {
  id: string;
  category: string;
  color: string;
}

type TagsData = Map<string, TagData>;

function getTagsField(tagsData: TagsData | undefined, field: keyof TagData) {
  var result = [];

  if(tagsData) {
    for(var [tagName, tagData] of tagsData) {
      result.push(tagData[field]);
    }
  }

  return result;
}

function getTagNamesByFieldValue(tagsData: TagsData | undefined, field: keyof TagData,
fieldValue: string) {
  var result = [];
  
  if(tagsData) {
    for(var [tagName, tagData] of tagsData) {
      if(tagData[field] === fieldValue) result.push(tagName);
    }
  }

  return result;
};

function getTagNamesByFieldValues(tagsData: TagsData | undefined, field: keyof TagData,
fieldValues: string[]) {
  var result = [];
  
  if(tagsData) {
    for(var [tagName, tagData] of tagsData) {
      if(fieldValues.includes(tagData[field])) result.push(tagName);
    }
  }

  return result;
};

function convertTagsAPIData(tagsAPIData: any[]) {
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

function convertUserTagsAPIData(userTagsAPIData: any[]) {
  var result: string[] = [];

  for(var userTagAPIData of userTagsAPIData) {
    result.push(userTagAPIData.tag_id);
  }

  return result;
}

function getTagsDataByNames(tagNames: string[], allTagsData: TagsData | undefined) {
  var result: TagsData = new Map();

  if(allTagsData) {
    for(var tagName of tagNames) {
      var tagData = allTagsData.get(tagName);
      if(tagData) result.set(tagName, tagData);
    }
  }

  return result;
};

function createTagComponents(tagsData: TagsData | undefined) {
  var result = [];
  
  if(tagsData) {
    for(var [tagName, tagData] of tagsData) {
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
};

function setCategoryTags(tagCategory: string, userId: string,
setAllCategoryTags: React.Dispatch<React.SetStateAction<TagsData | undefined>>,
selectCategoryTags: React.Dispatch<React.SetStateAction<string[] | undefined>>) {
  const getTagsByCategory = "http://localhost:3000/tags/classification/" + tagCategory;
  const getUserTagsByCategory = "http://localhost:3000/userTags/userId/" + userId
  + "/classification/" + tagCategory

  getAPIData(getTagsByCategory).then((categoryTagsResponse) => {
    if(categoryTagsResponse) {
      var academicTagsData = convertTagsAPIData(categoryTagsResponse);
      setAllCategoryTags(academicTagsData);

      getAPIData(getUserTagsByCategory).then((userCategoryTagsResponse) => {
        if(userCategoryTagsResponse) {
          var selectedTagIds = convertUserTagsAPIData(userCategoryTagsResponse);
          var selectedTagNames = getTagNamesByFieldValues(
            academicTagsData, "id", selectedTagIds);
          selectCategoryTags(selectedTagNames);
        }
      });
    }
  });
}

async function saveUserTags(userId: string, allTagsData: {selected: string[], all: TagsData}[],
router: Router) {
  var tagIdsCombined: string[] = [];

  for(var tagsData of allTagsData) {
    var tagIds = getTagsField(getTagsDataByNames(tagsData.selected, tagsData.all), "id");
    tagIdsCombined = tagIdsCombined.concat(tagIds);
  }

  try {
    const response = await axios.put("http://localhost:3000/userTags/userId/" + userId, {
      tag_ids: tagIdsCombined
    });

    console.log(response);
    router.navigate("/home");

    return;
  } catch (error) {
    console.error("Error posting user tags:", error);
    Alert.alert("Save Failed", "Could not save your preferences.");
  }
};

export default function PreferencesScreen() {
  const router = useRouter();

  const [userId, setUserId] = useState<string>();

  const [academicTags, setAcademicTags] = useState<TagsData>();
  const [sportsTags, setSportsTags] = useState<TagsData>();
  const [clubTags, setClubTags] = useState<TagsData>();
  const [careerTags, setCareerTags] = useState<TagsData>();

  const [selectedAcademicTags, selectAcademicTags] = useState<string[]>();
  const [selectedSportsTags, selectSportsTags] = useState<string[]>();
  const [selectedClubTags, selectClubTags] = useState<string[]>();
  const [selectedCareerTags, selectCareerTags] = useState<string[]>();

  var content: JSX.Element | null = null;

  useEffect(() => {
    getUserId().then((userIdResponse) => {
      if(userIdResponse) {
        setUserId(userIdResponse);

        setCategoryTags("academics", userIdResponse, setAcademicTags, selectAcademicTags);
        setCategoryTags("sports", userIdResponse, setSportsTags, selectSportsTags);
        setCategoryTags("clubs", userIdResponse, setClubTags, selectClubTags);
        setCategoryTags("career", userIdResponse, setCareerTags, selectCareerTags);
      }
    });
  }, []);

  if(userId) {
    if(academicTags
    && sportsTags
    && clubTags
    && careerTags
    && selectedAcademicTags
    && selectedSportsTags
    && selectedClubTags
    && selectedCareerTags) {
      content =
        <View>
          <HeaderText fontSize={32}>Your Tags of Interest</HeaderText>
          <RoundedBox width="90%" height="auto" className="mx-auto my-5 flex flex-row flex-wrap justify-center">
            {createTagComponents(getTagsDataByNames(selectedAcademicTags, academicTags))}
            {createTagComponents(getTagsDataByNames(selectedSportsTags, sportsTags))}
            {createTagComponents(getTagsDataByNames(selectedClubTags, clubTags))}
            {createTagComponents(getTagsDataByNames(selectedCareerTags, careerTags))}
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
            scale={1.5} onPress={() => saveUserTags(userId,
            [{selected: selectedAcademicTags, all: academicTags},
            {selected: selectedSportsTags, all: sportsTags},
            {selected: selectedClubTags, all: clubTags},
            {selected: selectedCareerTags, all: careerTags}],
            router)}/>
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