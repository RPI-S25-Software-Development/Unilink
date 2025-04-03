import { Text, View, Image } from "react-native";
import { EvilIcons } from "@expo/vector-icons";

import ImageViewer from "@/components/ImageViewer";
import RoundedBox from "@/components/RoundedBox";

import { EventDetailsItem } from "@/components/EventBox";

type EventText = {
  title: string;
  description: string;
  details: EventDetailsItem[];
}

type Props = {
  imageSource: any;
  eventText: EventText;
}

export default function EventBox({ imageSource, eventText }: Props) {
}