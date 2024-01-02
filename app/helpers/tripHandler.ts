import { Alert } from "react-native";
import { supabase } from "../lib/supabase";
import { AuthSession } from "@supabase/supabase-js";
import { router } from "expo-router";
import { Dispatch, SetStateAction } from "react";


export async function fetchSession(): Promise<AuthSession | null> {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }
      if (data && data.session) {
        return data.session;
      }
      return null;
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
      return null;
    }
}

export interface Trip {
  id: string;
  name: string;
  slug: string;
}

export async function getTrips(
    sessionData: AuthSession | null,
    setUserTrips: Dispatch<SetStateAction<Trip[]>>,
    setLoading: Dispatch<SetStateAction<boolean>>
  ): Promise<void> {
    try {
      setLoading(true);
      if (!sessionData?.user) {
        router.replace('/(auth)/login');
        throw new Error('No user on the session!');
      }
  
      let { data, error, status } = await supabase
        .from('trip_members')
        .select(`
        trips (
          id,
          name,
          slug
        )`)
        .eq('member_id', sessionData.user.id);
  
      if (error && status !== 406) {
        throw error;
      }
  
      if (data) {
        const tripNamesArray: Trip[] = [];
  
        data.forEach((item, index) => {
          if (!item.trips) {
            throw new Error(`Trips is null at index ${index}`);
          }
          tripNamesArray.push(item.trips);
        });
  
        setUserTrips(tripNamesArray);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

export async function addTrip(
  sessionData: AuthSession | null,
  newTripName: string,
  setLoading: Dispatch<SetStateAction<boolean>>,
  startDate: Date,
  endDate: Date
) {
  try {
    setLoading(true);
    if (!sessionData?.user) {
      router.replace('/(auth)/login');
      throw new Error('No user on the session!');
    }

    let slug = newTripName.toLowerCase().replace(/[^\w ]+/g, "").replace(/ +/g, "-");

    let { data: trip_data, error: trip_error, status: trip_status } = await supabase
      .from('trips')
      .insert([
        { name: newTripName, slug: slug, start_datetime: startDate.toDateString(), end_datetime: endDate.toDateString() },
      ])
      .select();

    if (trip_data) {
      let { data: trip_members_data, error: trip_members_error, status: trip_members_status } = await supabase
        .from('trip_members')
        .insert([
          { trip_id: trip_data[0].id, member_id: sessionData.user.id, start_datetime: startDate, end_datetime: endDate },
        ])
        .select();
    } else {
      throw new Error('Trip not created!');
    }
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert(error.message);
    }
  } finally {
    setLoading(false);
    Alert.alert(`Trip ${newTripName} successfully added.`);
    router.replace('/');
  }
}

  export async function checkUserExists(username: string, setLoading: Dispatch<SetStateAction<boolean>>): Promise<{ exists: boolean | null; userId?: string | null }> {
    try {
      setLoading(true);
  
      let { data, error, status } = await supabase
        .from('profiles')
        .select(`
        id
        `)
        .eq('username', username);
  
      if (error && status !== 406) {
        throw error;
      }
  
      // check if username already exists in trip
      if (data && data.length === 0 || data == null) {
        return { exists: false, userId: null };
      } else {
        const userId = data[0].id;
        return { exists: true, userId };
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
      return { exists: null };
    } finally {
      setLoading(false);
    }
  }
  
  export async function checkUserInTrip(username: string, selectedTrip: string | string[], setLoading: Dispatch<SetStateAction<boolean>>): Promise<boolean | null> {
    try {
      setLoading(true);
  
      let { data, error, status } = await supabase
        .from('trip_members')
        .select(`
        profiles (username)
        `)
        .eq('profiles.username', username)
        .eq('trip_id', selectedTrip);
  
      if (error && status !== 406) {
        throw error;
      }
  
      // check if username already exists in trip
      if (data && data[1].profiles?.username) {
        Alert.alert('User already in trip!');
        return true;
      } else {
        return false;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
      return null;
    } finally {
      setLoading(false);
    }
  }
  
  export async function addUserToTrip(userId: string, tripId: string, setLoading: Dispatch<SetStateAction<boolean>>): Promise<void> {
    try {
      setLoading(true);
  
      let { data, error, status } = await supabase
        .from('trip_members')
        .insert([
          { trip_id: tripId, member_id: userId },
        ])
        .select();
  
      Alert.alert('User added!');
  
      if (error && status !== 406) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  export async function deleteUserFromTrip(userId: string, tripId: string, setLoading: Dispatch<SetStateAction<boolean>>): Promise<void> {
    try {
      setLoading(true);
  
      let { data, error, status } = await supabase
        .from('trip_members')
        .delete()
        .eq('trip_id', tripId)
        .eq('user_id', userId);
  
      Alert.alert('User deleted!');
  
      if (error && status !== 406) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }


  export interface User {
    id: string;
    username: string;
    email: string;
  }

  export async function getTripMembers(
    sessionData: AuthSession | null,
    tripId: string,
    setTripMembers: Dispatch<SetStateAction<User[]>>,
    setLoading: Dispatch<SetStateAction<boolean>>
  ): Promise<void> {
    try {
      setLoading(true);
      if (!sessionData?.user) {
        router.replace('/(auth)/login');
        throw new Error('No user on the session!');
      }
  
      let { data, error, status } = await supabase
        .from('trip_members')
        .select(`
        profiles (
          id,
          username,
          email
        )`)
        .eq('trip_id', tripId);
  
      if (error && status !== 406) {
        throw error;
      }
  
      if (data) {
        const userArray: User[] = [];
  
        data.forEach((item, index) => {
          if (!item.profiles) {
            throw new Error(`Users is null at index ${index}`);
          }
          userArray.push(item.profiles);
        });
  
        setTripMembers(userArray);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }