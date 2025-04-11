import { Text } from "react-native";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  fontSize: number;
  className?: string;
  centerText?: boolean;
}>;

export default function HeaderText({ children, fontSize, className = "",
centerText=true }: Props) {
  return <Text className={`font-bold ${centerText ? "text-center" : ""} ${className}`}
  style={{fontSize: fontSize}}>
    {children}
  </Text>;
};