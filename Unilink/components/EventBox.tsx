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
      <View className="flex flex-row">
          {icon}
          <Text>{text}</Text>
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
      <ImageViewer imgSource={imageSource}/>
      {exportEventDetails(eventText)}
      <View className="flex flex-row justify-end">
        <SmallButton icon="heart"/>
        <SmallButton icon="star"/>
      </View>
    </RoundedBox>
  )
};

  //   return (
  //     <RoundedBox width={325} height={500}>
  //       <ImageViewer imgSource={imageSource} />
  //       <View className="flex">
  //         <Text className="m-1">@SSTF</Text>
  //         <Text className="m-1">Join us for the Litter Bug Battle!</Text>
  //         <View className="flex flex-col ml-1 mt-1">
  //           <View className="flex flex-row">
  //             <EvilIcons name="location" size={26} color="black" />
  //             <Text className="m-1">'87 Gym</Text>
  //           </View>
  //           <View className="flex flex-row">
  //             <EvilIcons name="clock" size={26} color="black" />
  //             <Text className="m-1">Oct 27, 12-4</Text>
  //           </View>
  //         </View>
  //       </View>
  //       <View className="flex flex-row justify-end">
  //         <SmallButton icon={'heart'}/>
  //         <SmallButton icon={'star'}/>
  //       </View>
  //     </RoundedBox>
  //   );
  // }