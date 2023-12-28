import { StatusBar } from "expo-status-bar";
import { Alert, Platform, StyleSheet } from "react-native";

import { Text, View, TextInput } from "../../components/Themed";
import { Button } from "react-native-elements";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { Link, router } from "expo-router";
import { fetchSession, getGroups, addGroup, Group } from "../helpers/groupHandler";

export default function ModalScreen() {
  const [loading, setLoading] = useState<boolean>(true);
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [session, setSession] = useState<Session | null>(null);
  const [userGroups, setUserGroups] = useState<Group[]>([]);

  const isPresented = router.canGoBack();

  useEffect(() => {
    async function fetchData() {
      const sessionData = await fetchSession();
      if (sessionData) {
        setSession(sessionData);
        await getGroups(sessionData, setUserGroups, setLoading);
      }
    }

    fetchData();
  }, []);

 
  async function handleNewGroupButtonClick() {
    if (!session) {
      Alert.alert('No user on the session!');
      return;
    }

    if (userGroups.some(group => group.name === newGroupName)) {
      Alert.alert(`Group "${newGroupName}" already exists!`);
    } else if (newGroupName === '') {
      Alert.alert('Enter a group name');
    } else if (newGroupName.length >= 100) {
      Alert.alert('Enter a group name of less than 100 characters');
    } else {
      await addGroup(session, newGroupName, setLoading);
      // Reload groups after adding a new group
      await getGroups(session, setUserGroups, setLoading);
    }
  }

  return (
    <>
      <View style={styles.container}>
      {!isPresented && <Link href="../">Dismiss</Link>}
        <Text style={styles.title}>Create Group</Text>
        <View style={styles.verticallySpaced}>
        <TextInput placeholder="Group Name"  onChangeText={(text) => setNewGroupName(text)} lightColor="#eee" darkColor="#000" />
        <Button title='+ Add Group' onPress={() => handleNewGroupButtonClick()}></Button>
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