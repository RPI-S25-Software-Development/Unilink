import { View, Text } from "react-native";

type Props = {
  backgroundColor: string,
  textColor?: string,
  name: string,
  compact?: boolean
};

export default function EventTag({backgroundColor, textColor="#fff", name, compact = false}: Props) {
  const textSizeClass = compact ? "text-md" : "text-lg";
  const paddingClasses = compact ? "px-3" : "py-1 px-12";

  return <View className="my-2 mr-2"
  style={{backgroundColor: backgroundColor, borderRadius: 15, borderWidth: 3}}>
    <Text className={`${paddingClasses} ${textSizeClass}`} style={{color: textColor}}>{name}</Text>
  </View>
};