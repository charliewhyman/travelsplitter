import { Alert, StyleSheet } from 'react-native';
import {useLocalSearchParams, useNavigation } from 'expo-router';
import { Text, TextInput, View } from '../../components/Themed';
import React, { useState } from 'react';
import { Button } from 'react-native-elements';
import { addUserToTrip, checkUserExists, checkUserInTrip } from '../helpers/tripHandler';
import TripMembers from '../../components/TripMembers';

type LocalSearchParams = {
  id: string,
  name: string,
  slug: string
};

export default function Trip() {
    const { id, name, slug } = useLocalSearchParams<LocalSearchParams>();
    const navigation = useNavigation();
    const [newUser, setNewUser] = useState<string >('');
    const [loading, setLoading] = useState(false);
    const [selectedTrip, setSelectedTrip]= useState<string | string[]>('');

    const [userExists, setUserExists] = useState<{ exists: boolean | null; userId?: string | null }>({ exists: null });
    const [userInTrip, setUserInTrip] = useState<boolean | null>(null);
    
    React.useEffect(() => {      
          setSelectedTrip(id);
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
      <Text style={styles.title}>{name}</Text>
      <TripMembers></TripMembers>
      <View style={[styles.verticallySpaced, styles.mt20]} >
        <Text>Add Trip Member</Text>
        <TextInput placeholder='Username' onChangeText={(text) => setNewUser(text.toLowerCase())} lightColor="#000" darkColor="#eee"></TextInput>
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
      fontSize: 20,
      fontWeight: 'bold',
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: '80%',
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
  });
  
