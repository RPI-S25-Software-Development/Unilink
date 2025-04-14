import { Text, View, Image } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import ImageViewer from "@/components/ImageViewer";
import RoundedBox from "@/components/RoundedBox";
import { EventTextProps, exportEventDetailsRow } from "./EventBox";
import HeaderText from "./HeaderText";

type Props = {
  key: string;
  imageSource: any;
  eventText: EventTextProps;
}

export default function EventNotificationBox({ imageSource, eventText }: Props) {
  var exportedDetails = [];
  for(var detailRow of eventText.details) {
      exportedDetails.push(exportEventDetailsRow(detailRow));
  }

  return (
    <RoundedBox width="auto" height="auto" className="p-3">
      <View className="flex flex-row">
        <View className="m-auto">
          <ImageViewer imgSource={imageSource} width={100} height={100}/>
        </View>
        <View className="flex flex-col ml-4">
          <Text className="m-1 text-xl font-bold">{eventText.title}</Text>
          <Text className="m-1">{eventText.description}</Text>
          {exportedDetails}
        </View>
      </View>
    </RoundedBox>
  )
}