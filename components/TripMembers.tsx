
import { StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react'
import { View, Text } from './Themed';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Session } from '@supabase/supabase-js';
import { fetchSession, getTripMembers, User } from '../app/helpers/tripHandler';

type LocalSearchParams = {
    id: string,
    name: string,
    slug: string
  };

export default function TripMembers() {
  const { id, name, slug } = useLocalSearchParams<LocalSearchParams>();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<User[]>([]);
  const [session, setSession] = useState<Session | null>(null)
  const navigation = useNavigation();

  useEffect(() => {
    async function fetchData() {
      const session = await fetchSession();
      if (session) {
        await getTripMembers(session, id, setMembers, setLoading);
        setSession(session);
        setLoading(false);
      }
    }

    fetchData();
  }, [navigation]);
  
  return (
    <View>
      <Text style={styles.boldText}>Trip Members</Text>
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

const styles = StyleSheet.create({
  boldText: {
    fontWeight: 'bold'
  }
})
