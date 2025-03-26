import { Text, View, Platform } from "react-native";

type Props = {
    backgroundColor?: string;
    titleColor?: string;
    title: string;
    titleFontFamily?: string;
    titleBold?: boolean;
}

export default function Banner({ backgroundColor = "#fff", titleColor = "#000000", title,
titleFontFamily = "Inter", titleBold = false }: Props) {
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
            fontWeight: titleBold ? "bold" : "normal"
        }}>
            {title}
        </Text>
    </View>;
}