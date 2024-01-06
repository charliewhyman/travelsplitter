import { Alert, StyleSheet } from 'react-native';
import {useLocalSearchParams, useNavigation } from 'expo-router';
import { Separator, Text, TextInput, View } from '../../components/Themed';
import React, { useState } from 'react';
import { Button } from 'react-native-elements';
import { addUserToTrip, checkUserExists, checkUserInTrip, fetchSession } from '../helpers/tripHandler';
import TripMembers from '../../components/TripMembers';
import CalendarComponent from '../../components/Calendar';
import { getTripDates } from '../helpers/calendarHelper';
import { Session } from '@supabase/supabase-js';

type LocalSearchParams = {
  id: string,
  name: string,
  slug: string
};

export default function Trip() {
    const { id, name, slug } = useLocalSearchParams<LocalSearchParams>();
    const navigation = useNavigation();

    const [session, setSession] = useState<Session | null>(null)

    const [newUser, setNewUser] = useState<string >('');
    const [loading, setLoading] = useState(false);
    const [selectedTrip, setSelectedTrip]= useState<string | string[]>('');

    const [userExists, setUserExists] = useState<{ exists: boolean | null; userId?: string | null }>({ exists: null });
    const [userInTrip, setUserInTrip] = useState<boolean | null>(null);
    
    const [startDay, setStartDay] = useState<Date | null>(null);
    const [endDay, setEndDay] = useState<Date | null>(null);

    React.useEffect(() => { 
      async function fetchData() {
        const sessionData = await fetchSession();
        setSession(sessionData);

        if (sessionData) {
          setSelectedTrip(id);
          await getTripDates(sessionData, id, setStartDay, setEndDay, setLoading)
        }
      }    
      fetchData();    

          navigation.setOptions({ title: name})
        }, [navigation]);

        async function handleAddMemberButtonClick(username: string) {    
          try {
            setLoading(true);
      
            setUserExists({ exists: null, userId: null });
            setUserInTrip(null);
            
            await checkUserExists(username, setLoading);
            if (userExists.exists === true && userExists.userId) {
              await checkUserInTrip(username, selectedTrip, setLoading); 
              if (userInTrip === false) {
                await addUserToTrip(userExists.userId, id, setLoading);
              }
            }
          } catch (error: any) {
            Alert.alert("Error", error.message);
          } finally {
            setLoading(false);
          }
        }
      
    return (
    <View style={styles.container}>
        <Text>{startDay?.toDateString()}</Text>
        <Text>{endDay?.toDateString()}</Text>

      <Separator
          style={styles.separator}
        />
      <TripMembers></TripMembers>
      <View style={[styles.verticallySpaced, styles.mt20]} >
        <Text>Add Trip Member</Text>
        <TextInput style={[styles.px10, styles.mt10]} placeholder='Username' onChangeText={(text) => setNewUser(text.toLowerCase())}></TextInput>
        <Separator
          style={styles.separator}
        />
          <Button title="Add user" onPress={() => handleAddMemberButtonClick(newUser)} disabled={loading}/>
        </View>
    </View>
    )
};
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 25,
      fontWeight: 'bold',
    },
    verticallySpaced: {
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 4,
      paddingBottom: 4,
      alignSelf: 'stretch',
    },
    mt20: {
      marginTop: 20,
    },
    mt10: {
      marginTop: 10,
    },
    px10: {
      paddingLeft: 10,
      paddingRight: 10
    },
    separator: {
      marginVertical: 10,
      height: 1,
      width: "80%",
    }
  });
  
