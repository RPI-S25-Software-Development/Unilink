import { Text, View, Image } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import ImageViewer from "@/components/ImageViewer";
import RoundedBox from "@/components/RoundedBox";
import { EventTextProps } from "./EventBox";

type Props = {
  key: string;
  imageSource: any;
  eventText: EventTextProps;
}

export default function EventNotificationBox({ key, imageSource, eventText }: Props) {
  const [contentWidth, contentHeight] = [500, 100];
  
  return (
    <RoundedBox width="auto" height="auto" className="p-3">
      <View className="flex flex-row" style={{width: contentWidth, height: contentHeight}}>
        <ImageViewer imgSource={imageSource}/>
      </View>
    </RoundedBox>
  )
}