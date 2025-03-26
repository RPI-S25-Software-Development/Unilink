import { Text, View, Pressable } from 'react-native';

type Props = {
  label: string;
};

export default function MedButton({ label }: Props) {
  return (
    <View className="items-center">
      <Pressable className="h-12 w-[155] bg-white rounded-lg flex items-center justify-center shadow-md m-2 p-2 border-2 border-gray-300">
        <Text>{label}</Text>
      </Pressable>
    </View>
  );
}
