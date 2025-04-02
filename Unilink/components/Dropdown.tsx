import { useState } from "react";
import { View, Platform, DimensionValue } from "react-native";
import { Picker } from "@react-native-picker/picker";

type Props = {
  dropdownItems: {key: string, label: string}[];
  width: DimensionValue;
  defaultValue?: string;
}

function pickerItemComponents(items: {key: string, label: string}[]) {
  var result: JSX.Element[] = [];

  items.forEach(function(item) {
    result.push(<Picker.Item key={item.key} label={item.label}/>)
  });
  
  return result;
}

export default function Dropdown({dropdownItems, width, defaultValue}: Props) {
  const [selectedItem, setSelectedItem] = useState(defaultValue);

  return (
    <View style={{
      borderWidth: 3,
      borderRadius: 32,
      borderColor: "black",
      width: width,
      padding: (Platform.OS === "web" ? 10 : 0)
    }}>
      <Picker
        mode="dropdown"
        selectedValue={selectedItem}
        onValueChange={(itemValue, itemIndex) => setSelectedItem(itemValue)}
        style={{fontSize: 18, outline: "none"}}
      >
        {pickerItemComponents(dropdownItems)}
      </Picker>
    </View>
  )
}