
import { Alert, Pressable, StyleSheet, useColorScheme } from 'react-native';
import React, { useEffect, useState } from 'react'
import { View, Text } from './Themed';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { Session } from '@supabase/supabase-js';
import { deleteUserFromTrip, fetchSession, getTripMembers, User } from '../app/helpers/tripHandler';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

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

  const colorScheme = useColorScheme();
  const iconColor = Colors[colorScheme ?? 'light'].tint

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

  async function handleRemoveUserPress(userId: string, tripId: string) {
    if (!session) {
      Alert.alert('No user on the session!');
      return
    }

    try {
      setLoading(true);

      if (userId == session.user.id) {
        await deleteUserFromTrip(userId, tripId,setLoading)
        router.replace('/(tabs)/home')
      }
    
      if (userId && tripId) {
      await deleteUserFromTrip(userId, tripId,setLoading)
    } else {
      Alert.alert('Error', 'Trip and/or user not selected')
    }
  } catch (error: any) {
    Alert.alert("Error", error.message);
  } finally {
    setLoading(false);
  }
}
  
  return (
    <View>
      <Text style={styles.boldText}>Trip Members</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        members.map((member, index) => (
          <View key={member.id} style={styles.flexRow}>
            <Pressable onPress={() => handleRemoveUserPress(member.id, id)}>
              <Ionicons name="person-remove-outline" color={iconColor} size={20} style={styles.mr5} />
            </Pressable>
            <Text>{member.username}</Text>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  boldText: {
    fontWeight: 'bold'
  },
  flexRow: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 3
  },
  mr5: {
    marginRight: 5
  }
})
