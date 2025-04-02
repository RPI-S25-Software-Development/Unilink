import { useState } from "react";
import { View, Platform, DimensionValue } from "react-native";
import MultiSelect from "react-native-multiple-select";

type DropdownItem = {
  key: string,
  label: string
}

type Props = {
  dropdownItems: DropdownItem[];
  width: DimensionValue;
  noItemsSelectedText?: string;
  itemsSelectedText?: string;
  className?: string;
}

export default function Dropdown({dropdownItems, width, noItemsSelectedText, itemsSelectedText,
className = ""}: Props) {
  const [selectedItems, setSelectedItems] = useState<DropdownItem[]>([]);

  var onSelectedItemsChange = (selectedItems: DropdownItem[]) => {
    setSelectedItems(selectedItems);
  }

  return (
    <View style={{
      borderWidth: 3,
      borderRadius: 32,
      borderColor: "black",
      width: width,
      paddingHorizontal: 15,
      paddingTop: 10,
      paddingBottom: selectedItems.length == 0 ? 0: 10
    }} className={className}>
      <MultiSelect
        uniqueKey="key"
        displayKey="label"
        items={dropdownItems}
        onSelectedItemsChange={onSelectedItemsChange}
        selectedItems={selectedItems}
        tagRemoveIconColor="lightgray"
        tagTextColor="gray"
        tagBorderColor="gray"
        styleDropdownMenuSubsection={{borderColor: "white"}}
        styleTextDropdown={{fontWeight:"bold"}}
        styleTextDropdownSelected={{fontWeight:"bold"}}
        fontSize={16}
        selectText={selectedItems.length == 0 ?
          (noItemsSelectedText ? noItemsSelectedText: "Select an item")
          : (itemsSelectedText ? itemsSelectedText: "")
        }
      />
    </View>
  )
}