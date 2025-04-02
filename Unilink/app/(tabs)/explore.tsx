import { ScrollView, View } from "react-native";
import "@/global.css";

import { PlaceHolderEvent } from "@/app/(tabs)/home";

import RoundedBox from "@/components/RoundedBox";
import MedButton from "@/components/MedButton";
import HeaderText from "@/components/HeaderText";

export default function ExploreScreen() {
  return (
      <ScrollView className="flex-1">
        <View className="items-center py-4">
          <RoundedBox width="90%" height={10} className="my-3"/>
          <View className="my-3">
            <HeaderText fontSize={24}>Explore by Category</HeaderText>
            <ScrollView horizontal style={{maxHeight: 75}}>
              <View className="flex flex-row px-5">
                <MedButton label="Academic" scale={0.9} baseFontSize={16}/>
                <MedButton label="Sports" scale={0.9}baseFontSize={16}/>
                <MedButton label="Club" scale={0.9} baseFontSize={16}/>
                <MedButton label="Career" scale={0.9}baseFontSize={16}/>
              </View>
            </ScrollView>
          </View>
          {PlaceHolderEvent}
          {PlaceHolderEvent}
          {PlaceHolderEvent}
          {PlaceHolderEvent}
          {PlaceHolderEvent}
        </View>
      </ScrollView>
    );
}
