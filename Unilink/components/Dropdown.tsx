import { useState } from "react";
import { View, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";

type Props = {
  dropdownItems: {key: string, label: string}[];
  defaultValue?: string | null;
  placeholder?: string;
}

function pickerItemComponents(items: {key: string, label: string}[]) {
  var result: JSX.Element[] = [];

  items.forEach(function(item) {
    result.push(<Picker.Item key={item.key} label={item.label}/>)
  });
  
  return result;
}

export default function Dropdown({dropdownItems, defaultValue = null, placeholder = "(Select)"}: Props) {
  const [selectedItem, setSelectedItem] = useState(defaultValue);

  return (
    <View style={{
      backgroundColor: "white",
      borderColor: "black",
      borderWidth: 3,
      width: 150,
      height: 50,
      marginVertical: "5%",
      borderRadius: 15,
      padding: Platform.OS === "web" ? 15 : 0
    }}>
      <Picker
        selectedValue={selectedItem}
        onValueChange={(itemValue, itemIndex) => setSelectedItem(itemValue)}
        style={{marginTop: -2}}
      >
        {pickerItemComponents(dropdownItems)}
      </Picker>
    </View>
    // <DropDownPicker
    //   open={open}
    //   value={value}
    //   items={items}
    //   setOpen={setOpen}
    //   setValue={setValue}
    //   setItems={setItems}
    //   placeholder={placeholder}
    //   searchable={searchable}
    //   style={{borderWidth: 3, minHeight: "90%", marginVertical: "5%", borderRadius: 15}}
    //   dropDownContainerStyle={{borderWidth: 3}}
    //   listMode="SCROLLVIEW"
    // />
  )
}