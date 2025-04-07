// import React from 'react';
// import {StyleSheet, TextInput} from 'react-native';
// import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

// type Props = {
//     label: string;
//     scale?: number;
//     secureTextEntry: boolean;
//     onChangeText?: ((text: string) => void) | undefined;
// };

// const TextField = ({ label, scale = 1, secureTextEntry = false, onChangeText}: Props) => {
//   const [text] = React.useState(label);
//   const width = 150 * scale;

//   return (
//         <TextInput
//           className='h-12 bg-white rounded-md shadow-md m-1 p-3'
//           style={{width: width}}
//           onChangeText={onChangeText}
//           secureTextEntry={secureTextEntry}
//           value={text}
//         />
//   );
// };

// export default TextField;

import { TextInput, View, Text } from "react-native";

type Props = {
    label: string;
    value: string;
    scale?: number;
    secureTextEntry: boolean;
    onChangeText?: ((text: string) => void) | undefined;
};

export default function TextField({ label, scale = 1, onChangeText, value, secureTextEntry }: Props) {
  const width = 150 * scale; 
  return (
        <View className="mb-4">
            <Text className="text-base">{label}</Text>
            <TextInput
                className="h-12 border border-gray-300 rounded px-2 py-1 mt-1"
                style={{ width: width  }}
                onChangeText={onChangeText} 
                value={value}
                secureTextEntry={secureTextEntry}
            />
        </View>
    );
}


