import { Image } from "react-native";
import { EvilIcons, FontAwesome } from "@expo/vector-icons";

export type IconSource = {
    evilIcon?: keyof typeof EvilIcons.glyphMap;
    fontAwesome?: keyof typeof FontAwesome.glyphMap;
    imageSource?: any;
};

type IconProps = {
    iconSource: IconSource
    iconSize: number;
    iconColor: string;
}

export default function Icon({ iconSource, iconSize, iconColor }: IconProps) {
    if(iconSource.evilIcon) {
        return <EvilIcons name={iconSource.evilIcon} size={iconSize} color={iconColor}/>
    } else if(iconSource.fontAwesome) {
        return <FontAwesome name={iconSource.fontAwesome} size={iconSize} color={iconColor}/>
    } else if(iconSource.imageSource) {
        return <Image source={iconSource.imageSource} style={{ width: iconSize, height: iconSize }}/>
    }
}