import { ActivityIndicator } from "react-native";
import { DimensionValue } from "react-native";

type Props = {
    scale?: number;
    margin?: DimensionValue;
};

export default function LoadingSpinner({ scale = 1, margin = "auto" }: Props) {
    return <ActivityIndicator size="large" style={{margin: margin, transform: [{scale: scale}]}}/>;
}