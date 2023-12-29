import React, { useEffect, useState } from 'react'
import { View, Text } from './Themed';
import { Link, useNavigation } from 'expo-router';
import { Session } from '@supabase/supabase-js';
import { fetchSession, Trip, getTrips } from '../app/helpers/tripHandler';
import { Pressable } from 'react-native';

export default function Trips() {
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [session, setSession] = useState<Session | null>(null)
  const navigation = useNavigation();

  useEffect(() => {
    async function fetchData() {
      const session = await fetchSession();
      if (session) {
        await getTrips(session, setTrips, setLoading);
        setSession(session);
        setLoading(false);
      }
    }

    fetchData();
  }, [navigation]);
  
  return (
    <View>
      <Text>My Trips</Text>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        trips.map((trip, index) => (
          <Link key={index} href={{
            pathname: `/trip/${encodeURIComponent(trip.slug)}`,
            params: {id: trip.id, slug: trip.slug, name: trip.name} }
          } asChild>
            <Pressable>
              <Text>{trip.name}</Text>
            </Pressable>
          </Link>
        ))
      )}
    </View>
  );
}
