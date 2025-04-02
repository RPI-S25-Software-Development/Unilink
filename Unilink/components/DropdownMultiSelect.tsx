import { useState } from "react";
import { View, DimensionValue } from "react-native";
import { DropdownItem } from "@/components/Dropdown";
import MultiSelect from "react-native-multiple-select";

type Props = {
  dropdownItems: {key: string}[];
  selectedItemsState?: {
    selectedItems: string[];
    setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
  };
  width: DimensionValue;
  noItemsSelectedText?: string;
  itemsSelectedText?: string;
  className?: string;
}

export default function DropdownMultiSelect({dropdownItems, selectedItemsState, width, noItemsSelectedText,
itemsSelectedText, className = ""}: Props) {
  var selectedItems: string[];
  var setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
  if(selectedItemsState) {
    selectedItems = selectedItemsState.selectedItems;
    setSelectedItems = selectedItemsState.setSelectedItems;
  } else {
    [selectedItems, setSelectedItems] = useState<string[]>([]);
  }

  var onSelectedItemsChange = (dropdownSelectedItems: string[]) => {
    setSelectedItems(dropdownSelectedItems);
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
        displayKey="key"
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
        styleItemsContainer={{backgroundColor: "white", paddingVertical: "5%"}}
        hideSubmitButton={true}
        selectedItemTextColor="black"
        selectedItemIconColor="black"
      />
    </View>
  )
}