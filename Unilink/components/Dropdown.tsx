import { useState } from "react";

import DropDownPicker, { ValueType } from "react-native-dropdown-picker";
import StyleProp from "react-native";

type Props = {
  dropdownItems: {label: string, value: string}[];
  defaultValue?: ValueType | null;
  placeholder?: string;
  searchable?: boolean;
}

export default function Dropdown({dropdownItems, defaultValue = null, placeholder = "(Select)", searchable = false}: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [items, setItems] = useState(dropdownItems);

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      placeholder={placeholder}
      searchable={searchable}
      style={{borderWidth: 3, minHeight: "90%", marginVertical: "5%", borderRadius: 15}}
      dropDownContainerStyle={{borderWidth: 3}}
    />
  )
}