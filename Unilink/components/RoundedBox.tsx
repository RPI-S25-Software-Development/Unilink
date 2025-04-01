import { View } from "react-native";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
    width: number;
    height: number;
    className?: string;
}>

export default function RoundedBox({ children, width, height, className = "" }: Props) {
    return (
        <View className={`bg-white elevation-5 p-3 m-2 rounded-lg w-[${width}] h-[${height}] ${className}`}>
            {children}
        </View>
    )
};