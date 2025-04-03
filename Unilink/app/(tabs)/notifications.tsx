import { View, ScrollView } from "react-native";
import "@/global.css";

import HeaderText from "@/components/HeaderText";
import RoundedBox from "@/components/RoundedBox";

export default function NotificaionsScreen() {
  return (
    <ScrollView className="flex flex-col items-center">
      <HeaderText fontSize={32} className="m-5">Your Notifications</HeaderText>
      <RoundedBox width={500} height={100}/>
      <RoundedBox width={500} height={100}/>
      <RoundedBox width={500} height={100}/>
      <RoundedBox width={500} height={100}/>
      <RoundedBox width={500} height={100}/>
    </ScrollView>
  );
}