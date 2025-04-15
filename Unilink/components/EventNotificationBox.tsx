import { Text, View, Image } from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import ImageViewer from "@/components/ImageViewer";
import RoundedBox from "@/components/RoundedBox";
import { EventTextProps, exportEventDetailsRow } from "./EventBox";
import HeaderText from "./HeaderText";

export enum EventNotificationType {
  reminder24H = 'reminder24H'
};

type Props = {
  key: string;
  imageSource: any;
  eventText: EventTextProps;
  notificationType: EventNotificationType
}

function getNotificationTitle(eventTitle: string, notificationType: EventNotificationType) {
  switch(notificationType) {
    case EventNotificationType.reminder24H: return eventTitle + " is in 24 hours!"
    default: return eventTitle;
  }
}

export default function EventNotificationBox({ imageSource, eventText, notificationType }: Props) {
  var exportedDetails = [];
  for(var detailRow of eventText.details) {
      exportedDetails.push(exportEventDetailsRow(detailRow));
  }

  return (
    <RoundedBox width="auto" height="auto" className="p-3">
      <View className="flex flex-row">
        <View className="my-auto">
          <ImageViewer imgSource={imageSource} width={100} height={100}/>
        </View>
        <View className="flex flex-col ml-4">
          <Text className="m-1 text-xl font-bold">{getNotificationTitle(eventText.title, notificationType)}</Text>
          <Text className="m-1">{eventText.description}</Text>
          {exportedDetails}
        </View>
      </View>
    </RoundedBox>
  )
}