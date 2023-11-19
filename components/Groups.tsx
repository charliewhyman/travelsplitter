import React, { useEffect, useState } from 'react'
import { supabase } from '../app/lib/supabase';
import { View, Text } from './Themed';
import { Link, router, useNavigation } from 'expo-router';
import { Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Session } from '@supabase/supabase-js';

export default function Groups() {
  const [groups, setGroups] = useState<any[]>([]); // TODO add actual type
  const [session, setSession] = useState<Session | null>(null)
  const navigation = useNavigation();

  useEffect(() => {
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
  
    async function fetchGroups(sessionData: Session | null) {

      try {
        if (!sessionData?.user) {
          router.replace('/(auth)/login')
          throw new Error('GNo user on the session!')
        }

        let user = sessionData.user.id
        let { data: groupsData, error } = await supabase
          .from('group_members')
          .select(`
          id,
          groups (
            id,
            name,
            slug
          )
          `).eq('member_id', sessionData.user.id);

        if (error) {
          console.error('Error fetching groups: ', error.message);
        } else {
          console.log(groupsData)
          setGroups(groupsData || []);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching groups: ', error.message);
        }
      }
    }
    
    fetchGroups(session);
  }, []); // Run this effect only once, similar to componentDidMount

  return (
    <View>
      <Text>My Groups</Text>
      {groups.map((group) => (
        <Link key={group.id} href={{
          pathname: `/group/${group.slug}`,
          params: { id: group.id }
        }}
        
        asChild>
          <TouchableOpacity>
            <Text key={group.id}>{group.name} </Text>
          </TouchableOpacity>
        </Link>
      ))}
    </View>
  );
}
