import { Text, View, StyleSheet } from "react-native";

import "@/global.css";

import PlusButton from "@/components/PlusButton";
import Dropdown from "@/components/Dropdown";
import EventTag from "@/components/EventTag";

export default function ProfileScreen() {
  const currentYear = new Date().getFullYear();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
      }}
    >
      <Text className="font-bold py-8" style={{fontSize: 48}}>Build Your Profile</Text>
      <View style={{
        flex: 8/10,
        alignItems: "flex-start",
        width: "100%",
        paddingHorizontal: "5%"
      }}>
        <View className="my-4">
          <Text className="text-2xl font-bold underline">You as a Student</Text>
          <View className="my-2" style={{alignItems: "flex-start"}}>
            <Text className="text-xl font-bold">Major(s)</Text>
            <PlusButton/>
          </View>
          <View className="my-2" style={{alignItems: "flex-start"}}>
            <Text className="text-xl font-bold">Graduation Year</Text>
            <Dropdown
              dropdownItems={dropdownYears([currentYear, currentYear + 4], true)}
            />
          </View>
        </View>
        <View className="my-4">
          <Text className="text-2xl font-bold underline">Your App Preferences</Text>
          <View className="my-2" style={{alignItems: "flex-start"}}>
            <Text className="text-xl font-bold">Tags of Interest</Text>
            <View style={{flexDirection: "row", alignItems: "center"}}>
              <EventTag backgroundColor="#FF8F8F" name="Academic"/>
              <EventTag backgroundColor="#8FC9FF" name="Clubs"/>
              <EventTag backgroundColor="#FFBC8F" name="Career"/>
              <PlusButton size={20}/>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function dropdownYears(range: [number, number], backwards = false) {
  var result: {label: string, value: string}[] = [];

  if(backwards) {
    for(var i: number = range[1]; i >= range[0]; i--) {
      result.push({label: String(i), value: String(i)});
    }
  } else {
    for(var i: number = range[0]; i <= range[1]; i++) {
      result.push({label: String(i), value: String(i)});
    }
  }

  return result;
}