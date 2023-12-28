import { StatusBar } from "expo-status-bar";
import { Alert, Platform, StyleSheet } from "react-native";

import { Text, View, TextInput } from "../../components/Themed";
import { Button } from "react-native-elements";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { Link, router } from "expo-router";
import { fetchSession, getTrips, addTrip, Trip } from "../helpers/tripHandler";
import Calendar from '../../components/Calendar';

export default function ModalScreen() {
  const [loading, setLoading] = useState<boolean>(true);
  const [newTripName, setNewTripName] = useState<string>('');
  const [session, setSession] = useState<Session | null>(null);
  const [userTrips, setUserTrips] = useState<Trip[]>([]);

  const isPresented = router.canGoBack();

  useEffect(() => {
    async function fetchData() {
      const sessionData = await fetchSession();
      if (sessionData) {
        setSession(sessionData);
        await getTrips(sessionData, setUserTrips, setLoading);
      }
    }

    fetchData();
  }, []);

 
  async function handleNewTripButtonClick() {
    if (!session) {
      Alert.alert('No user on the session!');
      return;
    }

    if (userTrips.some(trip => trip.name === newTripName)) {
      Alert.alert(`Trip "${newTripName}" already exists!`);
    } else if (newTripName === '') {
      Alert.alert('Enter a trip name');
    } else if (newTripName.length >= 100) {
      Alert.alert('Enter a trip name of less than 100 characters');
    } else {
      await addTrip(session, newTripName, setLoading);
      // Reload trips after adding a new trip
      await getTrips(session, setUserTrips, setLoading);
    }
  }

  return (
    <>
      <View style={styles.container}>
      {!isPresented && <Link href="../">Dismiss</Link>}
        <Calendar/>
        <View style={styles.verticallySpaced}>
        <TextInput placeholder="Trip Name"  onChangeText={(text) => setNewTripName(text)} lightColor="#eee" darkColor="#000" />
        <Button title='+ Add Trip' onPress={() => handleNewTripButtonClick()}></Button>
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