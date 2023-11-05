import React, { useEffect, useState } from 'react'
import { supabase } from '../app/lib/supabase';
import { View, Text } from './Themed';
import { Link } from 'expo-router';
import { Pressable } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Groups() {
  const [groups, setGroups] = useState<any[]>([]); // TODO add actual type
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
