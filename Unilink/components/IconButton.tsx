import { View, Pressable } from 'react-native';
import Icon, { IconSource } from './Icon';

type Props = {
  iconSource: IconSource;
  iconColor: string;
  onPress?: () => void;
};

export default function IconButton({ iconSource, iconColor, onPress }: Props) {
  return (
    <View className="items-center">
      <Pressable 
        onPress={onPress} 
        className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md m-1"
      >
        <Icon iconSource={iconSource} iconSize={24} iconColor={iconColor} />
      </Pressable>
    </View>
  );
}
