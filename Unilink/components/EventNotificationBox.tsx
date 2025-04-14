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

export default function EventNotificationBox({ imageSource, eventText }: Props) {
  return (
    <RoundedBox width={500} height={100}/>
  )
}