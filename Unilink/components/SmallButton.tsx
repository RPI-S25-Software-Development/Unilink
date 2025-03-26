import { View, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type Props = {
  icon: string;
};

export default function SmallButton({ icon }: Props) {
  return (
    <View className="items-center">
      <Pressable 
        onPress={() => alert('Event Saved')} 
        className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md m-1"
      >
        {icon === 'heart' && <FontAwesome name="heart" size={24} color="red" />}
        {icon === 'star' && <FontAwesome name="star" size={24} color="gold" />}
      </Pressable>
    </View>
  );
}
