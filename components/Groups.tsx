import React, { useEffect, useState } from 'react'
import { View, Text } from './Themed';
import { Link, useNavigation } from 'expo-router';
import { Session } from '@supabase/supabase-js';
import { fetchSession, getGroups } from '../app/helpers/groupHandler';

export default function Groups() {
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<any[]>([]); // TODO add actual type
  const [session, setSession] = useState<Session | null>(null)
  const navigation = useNavigation();

  useEffect(() => {
    async function fetchData() {
      const session = await fetchSession();
      if (session) {
        await getGroups(session, setGroups, setLoading);
        setSession(session);
        setLoading(false);
      }
    }

    fetchData();
  }, [navigation]);
  
  return (
    <View>
      <Text>My Groups</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        groups.map((group, index) => (
          <Link key={index} href={{
            pathname: `/group/${group.slug}`,
            params: group }
          }>
            {group.name}
          </Link>
        ))
      )}
    </View>
  );
}
