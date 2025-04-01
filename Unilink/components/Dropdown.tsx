import { useState } from "react";
import { View, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";

type Props = {
  dropdownItems: {key: string, label: string}[];
  defaultValue?: string;
}

function pickerItemComponents(items: {key: string, label: string}[]) {
  var result: JSX.Element[] = [];

  items.forEach(function(item) {
    result.push(<Picker.Item key={item.key} label={item.label}/>)
  });
  
  return result;
}

export default function Dropdown({dropdownItems, defaultValue}: Props) {
  const [selectedItem, setSelectedItem] = useState(defaultValue);

  return (
    <View style={{
      borderWidth: 3,
      borderRadius: 32,
      borderColor: "black",
      width: 200,
      padding: (Platform.OS === "web" ? 10 : 0)
    }}>
      <Picker
        selectedValue={selectedItem}
        onValueChange={(itemValue, itemIndex) => setSelectedItem(itemValue)}
        style={{fontSize: 18, outline: "none"}}
      >
        {pickerItemComponents(dropdownItems)}
      </Picker>
    </View>
  )
}