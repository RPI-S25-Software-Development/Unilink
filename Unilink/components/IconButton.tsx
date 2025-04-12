import { View, Pressable } from 'react-native';
import Icon, { IconSource } from './Icon';
import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

type Props = {
  iconSource: IconSource;
  iconColor: string;
  buttonSelected?: boolean
  onPress?: () => void;
};

export default function IconButton({ iconSource, iconColor, buttonSelected = false, onPress }: Props) {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <View className="items-center">
      { loading ?
        <LoadingSpinner scale={1.5} margin={10}/>
        :
        <Pressable 
          onPress={async () => {
            if(onPress) {
              setLoading(true);
              await onPress();
              setLoading(false);
            }
          }}
          className="w-12 h-12 rounded-full flex items-center justify-center shadow-md m-1"
          style={{backgroundColor: buttonSelected ? "#dcdcfc" : "white"}}
        >
          <Icon iconSource={iconSource} iconSize={24} iconColor={iconColor} />
        </Pressable>
      }
    </View>
  );
}