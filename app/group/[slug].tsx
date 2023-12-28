import { Alert, StyleSheet } from 'react-native';
import {useLocalSearchParams, useNavigation } from 'expo-router';
import { Text, TextInput, View } from '../../components/Themed';
import React, { useState } from 'react';
import { Button } from 'react-native-elements';
import { addUserToGroup, checkUserExists, checkUserInGroup } from '../helpers/groupHandler';
import GroupMembers from '../../components/GroupMembers';

type LocalSearchParams = {
  id: string,
  name: string,
  slug: string
};

export default function Group() {
    const { id, name, slug } = useLocalSearchParams<LocalSearchParams>();
    const navigation = useNavigation();
    const [newUser, setNewUser] = useState<string >('');
    const [loading, setLoading] = useState(false);
    const [selectedGroup, setSelectedGroup]= useState<string | string[]>('');

    const [userExists, setUserExists] = useState<{ exists: boolean | null; userId?: string | null }>({ exists: null });
    const [userInGroup, setUserInGroup] = useState<boolean | null>(null);
    
    React.useEffect(() => {      
          setSelectedGroup(id);
        }, [navigation]);

        async function handleAddMemberButtonClick(username: string) {    
          try {
            setLoading(true);
      
            setUserExists({ exists: null, userId: null });
            setUserInGroup(null);
            
            await checkUserExists(username, setLoading);
            if (userExists.exists === true && userExists.userId) {
              await checkUserInGroup(username, selectedGroup, setLoading); 
              if (userInGroup === false) {
                await addUserToGroup(userExists.userId, id, setLoading);
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
      <GroupMembers></GroupMembers>
      <View style={[styles.verticallySpaced, styles.mt20]} >
        <Text>Add Group Member</Text>
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
  
