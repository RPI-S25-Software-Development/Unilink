import { Text, View, Image } from "react-native";
import { EvilIcons } from "@expo/vector-icons";

import ImageViewer from "@/components/ImageViewer";
import RoundedBox from "@/components/RoundedBox";
import SmallButton from "@/components/SmallButton";
import EventTag from "@/components/EventTag";

type IconSource = {
  evilIconName?: keyof typeof EvilIcons.glyphMap;
  imageSource?: any;
};

type EventDetailsRow = {
  key: string;
  iconSource: IconSource;
  text: string;
};

type EventTagProps = {
  backgroundColor: string;
  textColor?: string;
  name: string;
}

type EventTextProps = {
  tags: EventTagProps[];
  title: string;
  description: string;
  details: EventDetailsRow[];
};

export type InteractionCounts = {
  likeCount: number;
  rsvpCount: number;
}

type Props = {
  imageSource: any;
  eventText: EventTextProps;
  interactionCounts: InteractionCounts;
};

function exportEventTag({ backgroundColor, textColor = "white", name }: EventTagProps) {
  return (
    <EventTag key={name} backgroundColor={backgroundColor} textColor={textColor} name={name}
    compact={true}/>
  );
}

function exportEventDetailsRow({ key, iconSource, text }: EventDetailsRow) {
  const iconSize = 26;
  const iconColor = "black";
  
  var icon = undefined;

  if(iconSource.evilIconName) {
    icon = <EvilIcons name={iconSource.evilIconName} size={iconSize} color={iconColor}/>
  } else if(iconSource.imageSource) {
    icon = <Image source={iconSource.imageSource} style={{ width: iconSize, height: iconSize }}/>
  }

  return (
      <View key={key} className="flex flex-row items-center">
          {icon}
          <Text className="ml-1">{text}</Text>
      </View>
  );
};

function exportEventText({ tags, title, description, details }: EventTextProps) {
  var exportedTags = [];
  for(var tag of tags) {
    exportedTags.push(exportEventTag(tag));
  }

  var exportedDetails = [];
  for(var detailRow of details) {
      exportedDetails.push(exportEventDetailsRow(detailRow));
  }

  return (
      <View className="flex">
          <View className="flex flex-row flex-wrap">
            {exportedTags}
          </View>
          <Text className="m-1">{title}</Text>
          <Text className="m-1">{description}</Text>
          <View className="flex flex-col ml-1 mt-1">
              {exportedDetails}
          </View>
      </View>
  );
};

export default function EventBox({ imageSource, eventText, interactionCounts }: Props) {
  const contentWidth = 300;
  
  return (
    <RoundedBox width="auto" height="auto" className="p-3">
      <View style={{width: contentWidth}}>
        <View style={{marginHorizontal: "auto"}}>
          <ImageViewer imgSource={imageSource}/>
          {exportEventText(eventText)}
        </View>
        <View className="flex flex-row justify-end">
          <View className="flex flex-col items-center">
            <SmallButton icon="heart"/>
            <Text className="text-lg font-bold">{interactionCounts.likeCount}</Text>
          </View>
          <View className="flex flex-col items-center">
            <SmallButton icon="star"/>
            <Text className="text-lg font-bold">{interactionCounts.rsvpCount}</Text>
          </View>
        </View>
      </View>
    </RoundedBox>
  )
};