import { StyleSheet, Text, View } from "react-native";

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
        paddingLeft: "1%",
        paddingTop: "2%",
        paddingBottom: "1%"
    }}>
        <Text style={{
            color: titleColor,
            fontSize: 32,
            fontFamily: titleFontFamily,
            fontWeight: titleFontWeight
        }}>
            {title}
        </Text>
    </View>;
}