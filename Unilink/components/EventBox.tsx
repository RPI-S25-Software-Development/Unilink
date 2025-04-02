import { Text, View, Image } from "react-native";
import ImageViewer from '@/components/ImageViewer';
import RoundedBox from "@/components/RoundedBox";
import SmallButton from "@/components/SmallButton";

import { EvilIcons } from '@expo/vector-icons';

type IconSource = {
  evilIconName?: keyof typeof EvilIcons.glyphMap;
  imageSource?: any;
};

type EventDetailsRow = {
  key: string;
  iconSource: IconSource;
  text: string;
};

type EventTextProps = {
  eventTitle: string;
  eventDescription: string;
  eventDetails: EventDetailsRow[];
};

type Props = {
  imageSource: any;
  eventText: EventTextProps;
};

function exportEventDetailsRow({ iconSource, text }: EventDetailsRow) {
  const iconSize = 26;
  const iconColor = "black";
  
  var icon = undefined;

  if(iconSource.evilIconName) {
      icon = <EvilIcons name={iconSource.evilIconName} size={iconSize} color={iconColor}/>
  } else if(iconSource.imageSource) {
      icon = <Image source={iconSource.imageSource} style={{ width: iconSize, height: iconSize }}/>
  }

  return (
      <View className="flex flex-row items-center">
          {icon}
          <Text className="ml-1">{text}</Text>
      </View>
  );
};

function exportEventDetails({ eventTitle, eventDescription, eventDetails }: EventTextProps) {
  var exportedDetails = [];

  for(var detailRow of eventDetails) {
      exportedDetails.push(exportEventDetailsRow(detailRow));
  }

  return (
      <View className="flex">
          <Text className="m-1">{eventTitle}</Text>
          <Text className="m-1">{eventDescription}</Text>
          <View className="flex flex-col ml-1 mt-1">
              {exportedDetails}
          </View>
      </View>
  );
};

export default function EventBox({ imageSource, eventText }: Props) {
  const boxWidth = 325;
  const boxHeight = 500;
  
  return (
    <RoundedBox width={boxWidth} height={boxHeight}>
      <View style={{marginHorizontal: "auto"}}>
        <ImageViewer imgSource={imageSource}/>
        {exportEventDetails(eventText)}
      </View>
      <View className="flex flex-row justify-end">
        <SmallButton icon="heart"/>
        <SmallButton icon="star"/>
      </View>
    </RoundedBox>
  )
};