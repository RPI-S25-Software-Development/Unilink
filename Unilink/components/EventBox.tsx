import { Text, View } from "react-native";
import ImageViewer from "@/components/ImageViewer";
import RoundedBox from "@/components/RoundedBox";
import IconButton from "@/components/IconButton";
import EventTag from "@/components/EventTag";
import Icon, { IconSource } from "./Icon";

type EventDetailsRow = {
  key: string;
  iconSource: IconSource;
  text: string;
};

export type EventTagData = {
  id: string;
  name: string;
  category: string;
  backgroundColor: string;
  textColor?: string;
}

export type EventTextProps = {
  tags: EventTagData[];
  title: string;
  description: string;
  details: EventDetailsRow[];
};

export type EventInteractionData = {
  count: number;
  selected: boolean;
  buttonOnPress?: () => void;
}

export type EventInteractionsData = {
  like: EventInteractionData;
  rsvp: EventInteractionData;
}

type Props = {
  key: string;
  imageSource: any;
  eventText: EventTextProps;
  interactionsData: EventInteractionsData;
};

function exportEventTag({ backgroundColor, textColor = "white", name }: EventTagData) {
  return (
    <EventTag key={name} backgroundColor={backgroundColor} textColor={textColor} name={name}
    compact={true}/>
  );
}

export function exportEventDetailsRow({ key, iconSource, text }: EventDetailsRow) {
  const iconSize = 26;
  const iconColor = "black";
  
  var icon = <Icon iconSource={iconSource} iconSize={iconSize} iconColor={iconColor}/>

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
          <Text className="m-1 text-lg">{title}</Text>
          <Text className="m-1">{description}</Text>
          <View className="flex flex-col ml-1 mt-1">
              {exportedDetails}
          </View>
      </View>
  );
};

export default function EventBox({ imageSource, eventText, interactionsData }: Props) {
  const contentWidth = 300;
  
  return (
    <RoundedBox width="auto" height="auto" className="p-3">
      <View style={{width: contentWidth}}>
        <View style={{marginHorizontal: "auto"}}>
          <ImageViewer imgSource={imageSource} width={300} height={300}/>
          {exportEventText(eventText)}
        </View>
        <View className="flex flex-row justify-end">
          <View className="flex flex-col items-center">
            <IconButton iconSource={{fontAwesome: "heart"}} iconColor="red" buttonSelectedColor="lightpink"
            onPress={interactionsData.like.buttonOnPress} buttonSelected={interactionsData.like.selected}/>
            <Text className="text-lg font-bold">{interactionsData.like.count}</Text>
          </View>
          <View className="flex flex-col items-center">
            <IconButton iconSource={{fontAwesome: "star"}} iconColor="gold" buttonSelectedColor="papayawhip"
            onPress={interactionsData.rsvp.buttonOnPress} buttonSelected={interactionsData.rsvp.selected}/>
            <Text className="text-lg font-bold">{interactionsData.rsvp.count}</Text>
          </View>
        </View>
      </View>
    </RoundedBox>
  )
};