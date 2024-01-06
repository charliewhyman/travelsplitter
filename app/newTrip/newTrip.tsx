import { StatusBar } from "expo-status-bar";
import { Alert, Platform, StyleSheet } from "react-native";

import { View, TextInput, Separator } from "../../components/Themed";
import { Button } from "react-native-elements";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { Link, router } from "expo-router";
import { fetchSession, getUserTrips, addTrip, Trip } from "../helpers/tripHandler";
import moment from "moment";
import { DateTimePicker } from "../../components/DateTimePicker";

export default function NewTrip() {
  const [loading, setLoading] = useState<boolean>(true);
  const [newTripName, setNewTripName] = useState<string>('');
  const [session, setSession] = useState<Session | null>(null);
  const [userTrips, setUserTrips] = useState<Trip[]>([]);

  const defaultStartDate = new Date();
  const defaultEndDate = moment(defaultStartDate).add(7, 'days').toDate();

  const [startDay, setStartDay] = useState<Date | null>( defaultStartDate );
  const [endDay, setEndDay] = useState<Date | null>( defaultEndDate );

  const isPresented = router.canGoBack();

  useEffect(() => {
    async function fetchData() {
      const sessionData = await fetchSession();
      if (sessionData) {
        setSession(sessionData);
        await getUserTrips(sessionData, setUserTrips, setLoading);
      }
    }    

    fetchData();
  }, []);

 
  async function handleNewTripButtonClick() {
    if (!session) {
      Alert.alert('No user on the session!');
      return;
    }

    console.log(startDay)
    console.log(endDay)

    if (userTrips.some(trip => trip.name === newTripName)) {
      Alert.alert(`Trip "${newTripName}" already exists!`);
    } else if (newTripName === '') {
      Alert.alert('Enter a trip name');
    } else if (newTripName.length >= 100) {
      Alert.alert('Enter a trip name of less than 100 characters');
    } else if (startDay == null || endDay == null ) {
      Alert.alert('Select a trip start and end date')
    } else {
      await addTrip(session, newTripName, setLoading, startDay, endDay);
      // Reload trips after adding a new trip
      await getUserTrips(session, setUserTrips, setLoading);
    }
  }

  return (
    <>
      <View style={styles.container}>
      {!isPresented && <Link href="../">Dismiss</Link>}
        <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextInput style={[styles.px10, styles.mt20]} placeholder="Trip Name"  onChangeText={(text) => setNewTripName(text)}/>
        <Separator
          style={styles.separator}
        />
        <DateTimePicker/>
        <Separator/>
        <Button title='+ Add Trip' onPress={() => handleNewTripButtonClick()}></Button>
        </View>
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
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: "80%",
  },
    verticallySpaced: {
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 4,
      paddingBottom: 4,
      alignSelf: 'stretch',
    },
  px10: {
    paddingLeft: 10,
    paddingRight: 10
  },
  mt20: {
    marginTop: 20,
  },
});