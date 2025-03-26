import { StyleSheet, Text, View, Platform } from "react-native";
import ImageViewer from '@/components/ImageViewer';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import SmallButton from "./SmallButton";

const PlaceholderImage = require('@/assets/images/LitterBug.png');

export default function EventBox() {
    return (
      <View className="flex flex-col items-center m-2">
        <View className="bg-white shadow-md shadow-gray elevation-5 p-3 rounded-lg w-[325] h-[500]">
          <ImageViewer imgSource={PlaceholderImage} />
          <View className="flex">
            <Text className="m-1">@SSTF</Text>
            <Text className="m-1">Join us for the Litter Bug Battle!</Text>
            <View className="flex flex-row m-1 items-center">
              <EvilIcons name="location" size={26} color="black" />
              <Text className="m-1">'87 Gym</Text>
            </View>
            <View className="flex flex-row m-1 items-center">
              <EvilIcons name="clock" size={24} color="black" />
              <Text className="m-1">Oct 27, 12-4</Text>
            </View> 
          </View>
          <View className="flex flex-row justify-end">
            <SmallButton icon={'heart'}/>
            <SmallButton icon={'star'}/>
          </View>
        </View>
      </View>
    );
  }