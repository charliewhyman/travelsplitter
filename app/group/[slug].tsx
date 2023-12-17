import { Alert, StyleSheet } from 'react-native';
import { Stack, router, useGlobalSearchParams, useLocalSearchParams, useNavigation } from 'expo-router';
import { Text, TextInput, View } from '../../components/Themed';
import React, { useState } from 'react';
import { Button } from 'react-native-elements';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

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
    const [session, setSession] = useState<Session | null>(null);
    const [username, setUsername] = useState<string | null>('');

    const [userExists, setUserExists] = useState<{ exists: boolean | null; userId?: string | null }>({ exists: null });
    const [userInGroup, setUserInGroup] = useState<boolean | null>(null);

    React.useEffect(() => {      
          setSelectedGroup(id);
        }, [navigation]);
    
        async function checkUserExists(username: string) {
          try {
            setLoading(true)
    
            let { data, error, status } = await supabase
            .from('profiles')
            .select(`
            id
            `)
            .eq('username', username) 
          
            if (error && status !== 406) {
              throw error
            }
    
            // check if username already exists in group
            if (data && data.length === 0 || data == null) {
              setUserExists({ exists: false, userId: null });
              Alert.alert('User does not exist!')
            }
    
            else {
              const userId = data[0].id; 
              setUserExists({ exists: true, userId });
            }
            
          } catch (error) {
            if (error instanceof Error) {
              Alert.alert(error.message)
            }
          } finally {
            setLoading(false)
          }
        }
    
    async function checkUserInGroup(username: string) {
      try {
        setLoading(true)
        
        let { data, error, status } = await supabase
        .from('group_members')
        .select(`
        profiles (username)
        `)
        .eq('profiles.username', username)
        .eq('group_id', selectedGroup)
        
        if (error && status !== 406) {
          throw error
        }

        // check if username already exists in group
        if (data && data[1].profiles?.username) {
          setUserInGroup(true)
          Alert.alert('User already in group!')
        }

        else {
          setUserInGroup(false)
        }
        
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert(error.message)
        }
      } finally {
        setLoading(false)
      }
    }

  
    async function addUserToGroup(userId: string, groupId: string) {
      try {
        setLoading(true)

        let { data, error, status } = await supabase
        .from('group_members')
          .insert([
            { group_id: groupId, member_id: userId },
          ])
          .select();

          Alert.alert('User added!')
        
        if (error && status !== 406) {
          throw error
        }
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert(error.message)
        }
      } finally {
        setLoading(false)
      }
    }

    async function handleAddMemberButtonClick(username: string) {    
      try {
        setLoading(true);

        setUserExists({ exists: null, userId: null });
        setUserInGroup(null);
        
        await checkUserExists(username);
    
        if (userExists.exists === true && userExists.userId) {
          await checkUserInGroup(username);
    
          if (userInGroup === false) {
            await addUserToGroup(userExists.userId, id);
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
  
