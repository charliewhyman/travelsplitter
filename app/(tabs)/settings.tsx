import { Alert, Button } from 'react-native';
import { Text, View } from '../../components/Themed';
import { Stack } from 'expo-router';
import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  }, []);

  const logout = async () => {
    const {error} = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Sign out error", error.message);
    }
  }

  return (
    <SafeAreaView>
      <View>
        <Stack.Screen options={{ headerShown: true, title: "Settings"}}/>
        <Text>Current User: {user?.email}</Text>
        <Button title="Sign out" onPress={() => logout()} />
      </View>
    </SafeAreaView>
  );
}
