import { Text, View, ScrollView } from "react-native";
import { useState } from "react";
import { Link } from "expo-router";

import "@/global.css";

import PlusButton from "@/components/PlusButton";
import Dropdown from "@/components/Dropdown";
import EventTag from "@/components/EventTag";
import IconOption from "@/components/IconOption";

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
    <ScrollView stickyHeaderIndices={[0]}>
      <View className="md-8 bg-white" style={{
        flex: 1,
        alignItems: "center"
      }}>
        <Text className="font-bold p-6" style={{fontSize: 48}}>Build Your Profile</Text>
      </View>
      <ScrollView horizontal>
        <View style={{
          flex: 8/10,
          alignItems: "flex-start",
          width: "100%",
          paddingHorizontal: 25
        }}>
          <View className="my-2">
            <Text className="text-2xl font-bold underline">You as a Student</Text>
            <View className="my-2" style={{alignItems: "flex-start"}}>
              <Text className="text-xl font-bold">Major(s)</Text>
              <PlusButton/>
            </View>
            <View className="my-2" style={{alignItems: "flex-start"}}>
              <Text className="text-xl font-bold">Graduation Year</Text>
              <Dropdown dropdownItems={dropdownYears([currentYear, currentYear + 4], true)}/>
            </View>
          </View>
          <View className="my-2">
            <View className="my-2" style={{alignItems: "flex-start", width: "90%"}}>
              <Text className="text-2xl font-bold underline">Your App Preferences</Text>
              <View className="my-2" style={{alignItems: "flex-start"}}>
                <Text className="text-xl font-bold">Tags of Interest</Text>
                <View style={{flexDirection: "row", alignItems: "center", flexWrap: "wrap"}}>
                  <EventTag backgroundColor="#FF8F8F" name="Academic"/>
                  <EventTag backgroundColor="#8FC9FF" name="Clubs"/>
                  <EventTag backgroundColor="#FFBC8F" name="Career"/>
                  <PlusButton size={20}/>
                </View>
              </View>
            </View>
            <View className="my-2" style={{alignItems: "flex-start", width: "50%"}}>
              <Text className="text-xl font-bold">Notification Preferences</Text>
              <View style={{flexDirection: "row", alignItems: "center"}}>
                <IconOption iconImageSource={require("@/assets/images/Bell off.png")} iconSize={32}
                optionText="Disabled" optionTextColor="#656565" selected={!notificationsEnabled}
                selectionColor="#656565" onPress={disableNotifications}/>
                <IconOption iconImageSource={require("@/assets/images/Bell.png")} iconSize={32}
                optionText="Enabled" optionTextColor="#656565" selected={notificationsEnabled}
                selectionColor="#656565" onPress={enableNotifications}/>
              </View>
            </View>
          </View>
          <Link href="/home" className="my-2 rounded-lg" style={{backgroundColor: "#B61601", paddingHorizontal: 50,
          paddingVertical: 20}}>
            <Text className="text-white text-center text-lg">Continue</Text>
          </Link>
        </View>
      </ScrollView>
    </ScrollView>
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