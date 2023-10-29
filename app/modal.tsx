import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";

import { Text, View, TextInput } from "../components/Themed";
import { Button } from "react-native-elements";
import { useState } from "react";

export default function ModalScreen() {
  const [groupName, setGroupName] = useState('')

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Create Group</Text>
        <View style={styles.verticallySpaced}>
        <TextInput placeholder="Group Name"  onChangeText={(text) => setGroupName(text)} lightColor="#eee" darkColor="#000" />
        <Button title='+ Add Group'></Button>
        </View>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />

        {/* Use a light status bar on iOS to account for the black space above the modal */}
        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
});