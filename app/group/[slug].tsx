import { Alert, StyleSheet } from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { Text, TextInput, View } from '../../components/Themed';
import React, { useState } from 'react';
import { Button } from 'react-native-elements';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export default function Group() {
    const { slug, id } = useLocalSearchParams();
    const navigation = useNavigation();
    const [newUser, setNewUser] = useState<string >('')
    const [loading, setLoading] = useState(true)
    const [selectedGroup, setSelectedGroup]= useState<string | string[]>('');
    const [session, setSession] = useState<Session | null>(null)
    const [username, setUsername] = useState<string | null>('')
    const [userInGroup, setUserInGroup] = useState<boolean | null>(null)

    React.useEffect(() => {
          navigation.setOptions({
            headerShown: false,
            title: `Group: ${slug}`
          });
          
          async function fetchSession() {
            try {
              const { data, error } = await supabase.auth.getSession()
              if (error) {
                throw error
              }
              if (data && data.session) {
                setSession(data.session)
                
              }
            } catch (error) {
              if (error instanceof Error) {
                Alert.alert(error.message)
              }
            }
          }
          fetchSession()
          setSelectedGroup(id)
        }, [navigation]);
    
    
    //TODO add function to check if user is already in group
    //TODO add function to add user to group
    //does it need to email confirmation to the user?

    async function checkUserInGroup(sessionData: Session | null, username: string) {
      try {
        setLoading(true)
        if (!sessionData?.user) {
          router.replace('/(auth)/login')
          throw new Error('No user on the session!')
        }

        let { data, error, status } = await supabase
        .from('group_members')
        .select(`
        profiles (username)
        `)
        .eq('profiles.username', username)
        .eq('group_id', selectedGroup)
        
        console.log(data)
        if (error && status !== 406) {
          throw error
        }
  
        if (data && username != '' && username != null) {
        setUserInGroup(true)
        }
        else if (username == ''|| username == null) {
          Alert.alert('Enter a username to add to the group')
          setUserInGroup(false)
        } else {
          setUserInGroup(false)
        }
        
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert(error.message)
        }
      } finally {
        setLoading(false)
        console.log(userInGroup)
      }
    }

    return (
        <View style={styles.container}>
          <Text style={styles.title}>{slug}</Text>
          <View style={[styles.verticallySpaced, styles.mt20]} >
              <Text>Add Group Member</Text>
              <TextInput placeholder='Username' onChangeText={(text) => setNewUser(text.toLowerCase())} lightColor="#000" darkColor="#eee"></TextInput>
                <Button title="Add user" onPress={() => checkUserInGroup(session, newUser)} />
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
      paddingTop: 4,
      paddingBottom: 4,
      alignSelf: 'stretch',
    },
    mt20: {
      marginTop: 20,
    },
  });
  
