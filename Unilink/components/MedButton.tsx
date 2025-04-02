import { Text, View, Pressable } from 'react-native';

type Props = {
  label: string;
  backgroundColor?: string;
  textColor?: string;
  scale?: number;
};

export default function MedButton({ label, backgroundColor = "white", textColor = "black", scale = 1 }: Props) {
  const height = 50 * scale;
  const width = 150 * scale;
  const fontSize = 14 * scale;
  
  return (
    <View className="items-center">
      <Pressable className="rounded-lg flex items-center justify-center
      shadow-md shadow-gray m-3 p-2 border-2 border-gray-300"
      style={{backgroundColor: backgroundColor, height: height, width: width}}>
        <Text style={{color: textColor, fontSize: fontSize}}>{label}</Text>
      </Pressable>
    </View>
  );
}
