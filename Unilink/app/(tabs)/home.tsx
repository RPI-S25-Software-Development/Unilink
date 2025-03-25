import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import "@/global.css";

export default function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Home</Text>
    </View>
  );
}