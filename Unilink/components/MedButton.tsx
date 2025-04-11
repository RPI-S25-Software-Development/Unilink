import { Text, View, Pressable } from 'react-native';
import { useState } from 'react';

type Props = {
  label: string;
  backgroundColor?: string;
  textColor?: string;
  scale?: number;
  baseFontSize?: number;
  onPress?: () => void;
};

export default function MedButton({ label, backgroundColor = "white", textColor = "black", scale = 1, baseFontSize = 14,
onPress }: Props) {
  const height = 50 * scale;
  const width = 150 * scale;
  const fontSize = baseFontSize * scale;
  const marginHorizontal = 6 * scale;
  
  return (
    <View className="items-center">
      <Pressable className="rounded-lg flex items-center justify-center
      shadow-md shadow-gray my-3 p-3 border-2 border-gray-300"
      style={{backgroundColor: backgroundColor, height: height, width: width, marginHorizontal: marginHorizontal}}
      onPress={onPress}>
        <Text style={{color: textColor, fontSize: fontSize, textAlign: "center"}}>
          {label}
        </Text>
      </Pressable>
    </View>
  );
}
