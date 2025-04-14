import { Text, View, Image } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import ImageViewer from "@/components/ImageViewer";
import RoundedBox from "@/components/RoundedBox";
import { EventTextProps } from "./EventBox";
import HeaderText from "./HeaderText";

type Props = {
  key: string;
  imageSource: any;
  eventText: EventTextProps;
}

export default function EventNotificationBox({ key, imageSource, eventText }: Props) {
  return (
    <RoundedBox width="auto" height="auto" className="p-3">
      <View className="flex flex-row">
        <ImageViewer imgSource={imageSource} width={100} height={100}/>
        <View className="flex flex-col ml-4">
          <HeaderText fontSize={24}>{eventText.title}</HeaderText>
        </View>
      </View>
    </RoundedBox>
  )
}