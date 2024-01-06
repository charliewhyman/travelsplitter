import React, { useEffect, useState } from 'react'
import { View, Text } from './Themed';
import { Link, useNavigation } from 'expo-router';
import { Session } from '@supabase/supabase-js';
import { fetchSession, Trip, getUserTrips } from '../app/helpers/tripHandler';
import { Pressable, StyleSheet, useColorScheme } from 'react-native';
import { Subtitle } from './StyledText';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../constants/Colors';

export default function Trips() {
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [session, setSession] = useState<Session | null>(null)
  const navigation = useNavigation();
  
  const colorScheme = useColorScheme();
  const iconColor = Colors[colorScheme ?? 'light'].tint

  useEffect(() => {
    async function fetchData() {
      const session = await fetchSession();
      if (session) {
        await getUserTrips(session, setTrips, setLoading);
        setSession(session);
        setLoading(false);
      }
    }

    fetchData();
  }, [navigation]);
  
  return (
    <View>
      <Subtitle>My Trips</Subtitle>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        trips.map((trip, index) => (
          <Link key={index} href={{
            pathname: `/trip/${encodeURIComponent(trip.slug)}`,
            params: {id: trip.id, slug: trip.slug, name: trip.name} }
          } asChild>
            <Pressable>
              <View style={styles.flexRow}>
                <Ionicons name="airplane-outline" color={iconColor} size={25} style={styles.mr5} />
                <Text>{trip.name}</Text>
              </View>
            </Pressable>
          </Link>
        ))
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  flexRow: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 3
  },
  mr5: {
    marginRight: 5
  }
})
