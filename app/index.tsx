import { Redirect } from "expo-router";
import { Text } from "react-native";

export default function IndexPage() {
    return <Redirect href={"/(auth)/login"}/>
}