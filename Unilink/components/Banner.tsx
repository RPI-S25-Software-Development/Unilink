import { StyleSheet, Text, View, Platform } from "react-native";

type Props = {
    backgroundColor?: "#fff";
    titleColor?: "#00000";
    title: string;
    titleFontFamily?: "Inter";
    titleFontWeight?: "normal";
}

export default function Banner({ backgroundColor, titleColor, title, titleFontFamily, titleFontWeight }: Props) {
    return <View style={{
        backgroundColor: backgroundColor,
        paddingLeft: Platform.OS !== "web" ? "5%" : "2%",
        paddingTop: Platform.OS !== "web" ? "10%" : "2%",
        paddingBottom: Platform.OS !== "web" ? "3%" : "1%",
    }}>
        <Text style={{
            color: titleColor,
            fontSize: 20,
            fontFamily: titleFontFamily,
            fontWeight: titleFontWeight
        }}>
            {title}
        </Text>
    </View>;
}