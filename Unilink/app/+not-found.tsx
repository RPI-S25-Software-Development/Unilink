import { Redirect } from "expo-router";
import "@/global.css";

export default function NotFoundScreen() {
  return <Redirect href="/home"/>;
}