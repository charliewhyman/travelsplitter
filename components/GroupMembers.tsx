import React, { useEffect, useState } from 'react'
import { View, Text } from './Themed';
import { Link, useLocalSearchParams, useNavigation } from 'expo-router';
import { Session } from '@supabase/supabase-js';
import { fetchSession, getGroupMembers, User } from '../app/helpers/groupHandler';

type LocalSearchParams = {
    id: string,
    name: string,
    slug: string
  };

export default function GroupMembers() {
  const { id, name, slug } = useLocalSearchParams<LocalSearchParams>();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<User[]>([]);
  const [session, setSession] = useState<Session | null>(null)
  const navigation = useNavigation();

  useEffect(() => {
    async function fetchData() {
      const session = await fetchSession();
      if (session) {
        await getGroupMembers(session, id, setMembers, setLoading);
        setSession(session);
        setLoading(false);
      }
    }

    fetchData();
  }, [navigation]);
  
  return (
    <View>
      <Text>Group Members</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        members.map((member, index) => (
            <Text key={member.id}>
            {member.username}
          </Text>
        ))
      )}
    </View>
  );
}
