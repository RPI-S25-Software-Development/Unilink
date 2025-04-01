import { View, StyleSheet, Text, Pressable } from "react-native";
import { Image } from "expo-image";

import { Feather } from '@expo/vector-icons';

type IconSource = {
    featherIconName?: keyof typeof Feather.glyphMap;
    imageSource?: any;
}

type Props = {
    iconSource: IconSource,
    iconColor?: string,
    iconSize?: number,
    optionText?: string | null,
    optionTextColor?: string,
    selected?: boolean,
    selectionColor?: string,
    onPress: () => void;
};

export default function IconOption({iconSource, iconColor = "black", iconSize = 50, optionText, optionTextColor = "#000000",
selected = false, selectionColor = "#000000", onPress}: Props) {
    const selectedClasses = selected ? "border-2 rounded-md" : ""
    const selectedVisibilityClass = selected ? "visible" : "invisible";

    var icon = undefined;

    if(iconSource.featherIconName) {
        icon = <Feather name={iconSource.featherIconName} size={iconSize} color={iconColor}/>
    } else if(iconSource.imageSource) {
        icon = <Image source={iconSource.imageSource} style={{ width: iconSize, height: iconSize }}/>
    }

    return (
        <View className="my-2 mr-10" style={styles.container}>
            <Pressable className={`${selectedClasses} my-2`}
            style={[styles.container, styles.button, {borderColor: selectionColor}]} onPress={onPress}>
                {icon}
                {optionText && <Text style={{fontSize: 12, color: optionTextColor}}>{optionText}</Text>}
            </Pressable>
            <Text className={`underline font-bold ${selectedVisibilityClass}`} style={{color: selectionColor}}>Selected</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        padding: 5
    }
});