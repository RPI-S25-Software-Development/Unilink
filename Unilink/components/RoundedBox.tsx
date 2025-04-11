import { View, DimensionValue } from "react-native";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
    width: DimensionValue;
    height: DimensionValue;
    className?: string;
}>

export default function RoundedBox({ children, width, height, className = "" }: Props) {
    return (
        <View className={`bg-white shadow-md shadow-gray m-2 rounded-lg ${className}`}
        style={{width: width, height: height}}>
            {children}
        </View>
    )
};