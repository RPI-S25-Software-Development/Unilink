import { View, Platform } from "react-native";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
    backgroundColor?: string;
}>;

export default function Banner({ children, backgroundColor = "#fff"}: Props) {
    return <View style={{
        backgroundColor: backgroundColor,
        paddingLeft: Platform.OS !== "web" ? "5%" : "2%",
        paddingTop: Platform.OS !== "web" ? "10%" : "2%",
        paddingBottom: Platform.OS !== "web" ? "3%" : "1%",
    }}>
        {children}
    </View>;
}