import { useState } from "react";
import { View, DimensionValue } from "react-native";
import MultiSelect from "react-native-multiple-select";

export type DropdownSelectedItemsState = {
  selectedItems: string[] | undefined;
  setSelectedItems: React.Dispatch<React.SetStateAction<string[] | undefined>>;
};

type Props = {
  dropdownItems: {key: string}[];
  selectedItemsState?: DropdownSelectedItemsState;
  width: DimensionValue;
  noItemsSelectedText?: string;
  itemsSelectedText?: string;
  className?: string;
}

export default function DropdownMultiSelect({dropdownItems, selectedItemsState, width, noItemsSelectedText,
itemsSelectedText, className = ""}: Props) {
  var componentRef: MultiSelect | null = null;

  const [localSelectedItems, setLocalSelectedItems] = useState<string[]>(
    selectedItemsState && selectedItemsState.selectedItems ?
    selectedItemsState.selectedItems : []);

  var onSelectedItemsChange = (dropdownSelectedItems: string[]) => {
    setLocalSelectedItems(dropdownSelectedItems);
    if(!(componentRef?.state as any).selector && selectedItemsState) {
      selectedItemsState.setSelectedItems(dropdownSelectedItems);
    }
  }

  var onToggleList = () => {
    if((componentRef?.state as any).selector && selectedItemsState) {
      selectedItemsState.setSelectedItems(localSelectedItems);
    }
  }

  return (
    <View style={{
      borderWidth: 3,
      borderRadius: 32,
      borderColor: "black",
      width: width,
      paddingHorizontal: 15,
      paddingTop: 10,
      paddingBottom: localSelectedItems.length == 0 ? 0: 10
    }} className={className}>
      <MultiSelect
        ref = {(component) => {componentRef = component;}}
        uniqueKey="key"
        displayKey="key"
        items={dropdownItems}
        onSelectedItemsChange={onSelectedItemsChange}
        onToggleList={onToggleList}
        selectedItems={localSelectedItems}
        tagRemoveIconColor="lightgray"
        tagTextColor="gray"
        tagBorderColor="gray"
        styleDropdownMenuSubsection={{borderColor: "white"}}
        styleTextDropdown={{fontWeight:"bold"}}
        styleTextDropdownSelected={{fontWeight:"bold"}}
        fontSize={16}
        selectText={localSelectedItems.length == 0 ?
          (noItemsSelectedText ? noItemsSelectedText: "Select an item")
          : (itemsSelectedText ? itemsSelectedText: "")
        }
        styleItemsContainer={{backgroundColor: "white", paddingVertical: "5%"}}
        selectedItemTextColor="black"
        selectedItemIconColor="black"
        hideDropdown={true}
        textInputProps={{
          autoFocus: false
        }}
      />
    </View>
  )
}