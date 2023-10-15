import React, { useEffect, useState } from 'react'
import { supabase } from '../app/lib/supabase';
import { View, Text } from './Themed';
import { Link } from 'expo-router';

export default function Groups() {
  const [groups, setGroups] = useState<any[]>([]); // Replace 'any' with the actual type of your groups

  useEffect(() => {
    async function fetchData() {
      try {
        let { data: groupsData, error } = await supabase
          .from('groups')
          .select(`
            id,
            name,
            slug
          `);

        if (error) {
          console.error('Error fetching groups: ', error.message);
        } else {
          setGroups(groupsData || []);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching groups: ', error.message);
        }
      }
    }

    fetchData();
  }, []); // Run this effect only once, similar to componentDidMount

  return (
    <View>
      {groups.map((group) => (
        <Link key={group.id} href={`/group/${group.slug}`}>
          <Text key={group.id}>{group.name}</Text>
        </Link>
      ))}
    </View>
  );
}
