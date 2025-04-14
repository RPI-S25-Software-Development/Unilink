import { Platform, Pressable } from "react-native";

import AntDesign from '@expo/vector-icons/AntDesign';

type Props = {
  backgroundColor?: string,
  plusColor?: string,
  size?: number,
  shadow?: boolean
}

export default function PlusButton({backgroundColor = "#909090", plusColor = "#FFFFFF",
size=16, shadow=true}: Props) {
  return (
    <Pressable className={`rounded-full m-2 ${shadow? "shadow-md": ""}`} style={{
      backgroundColor: backgroundColor,
      paddingHorizontal: Platform.OS === "web" ? 5 : 4,
      paddingVertical: 4
    }}>
      <AntDesign name="plus" size={size} color={plusColor}/>
    </Pressable>
  )
};