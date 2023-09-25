import { Alert, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { Stack, router } from 'expo-router';
import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

export default function SettingsPage() {

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
      } else {
        Alert.alert("Unable to access user")
      }
    })
  }, [])

  return (
    <View>
      <Stack.Screen options={{ headerShown: true, title: "Settings"}}/>
    </View>
  );
}
