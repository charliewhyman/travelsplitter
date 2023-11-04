import { StatusBar } from "expo-status-bar";
import { Alert, Platform, StyleSheet } from "react-native";

import { Text, View, TextInput } from "../components/Themed";
import { Button } from "react-native-elements";
import { useEffect, useState } from "react";
import { supabase, DbResult } from "./lib/supabase";
import { Session } from "@supabase/supabase-js";
import { router } from "expo-router";

export default function ModalScreen() {
  const [loading, setLoading] = useState(true)
  const [newGroupName, setNewGroupName] = useState('')
  const [session, setSession] = useState<Session | null>(null)
  const [groupNames, setGroupNames] = useState<any[]>([]); // Replace 'any' with the actual type of your groups

  useEffect(() => {
    async function fetchSession() {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          throw error
        }
        if (data && data.session) {
          setSession(data.session)
          getGroups(data.session)
        }
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert(error.message)
        }
      }
    }
    fetchSession()
  }, [])

  async function getGroups(sessionData: Session | null) {
    try {
      setLoading(true)
      if (!sessionData?.user) {
        router.replace('/(auth)/login')
        throw new Error('No user on the session!')
      }

      let { data, error, status } = await supabase
        .from('group_members')
        .select(`
        groups (
          name
        )`)
        .eq('member_id', sessionData.user.id)

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        const groupNamesArray: string[] = [];

        data.forEach((item, index) => {
          if (!item.groups) {
              throw new Error(`Groups is null at index ${index}`);
          }
          groupNamesArray.push(item.groups.name); // Push the "name" value to the array if "groups" is not null
      });

      setGroupNames(groupNamesArray);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function addGroup() {
    
  }

  function handleNewGroupButtonClick() {
    getGroups(session)

    if (groupNames.includes(newGroupName)) {
      Alert.alert(`Group "${newGroupName}" already exists!`)
    } else if (newGroupName == ""){
      Alert.alert(`Enter a group name`)
    } else {
      console.log(`Group ${newGroupName} added`)
    }
}

  return (
    <>
      <View style={styles.container}>
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