import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, Alert } from 'react-native'
import { Button } from 'react-native-elements'
import { Session } from '@supabase/supabase-js'
import Avatar from '../../components/Avatar'
import { View, TextInput, Text } from '../../components/Themed'
import { router } from 'expo-router'

export default function Account() {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [nonce, setNonce] = useState('')
  const [newPassword, setnewPassword] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    async function fetchSession() {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          throw error
        }
        if (data && data.session) {
          setSession(data.session)
          getProfile(data.session)
        }
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert(error.message)
        }
      }
    }
    fetchSession()
  }, [])

  async function getProfile(sessionData: Session | null) {
    try {
      setLoading(true)
      if (!sessionData?.user) {
        router.replace('/(auth)/login')
        throw new Error('No user on the session!')
      }
      let { data, error, status } = await supabase
        .from('profiles')
        .select(`id, username, avatar_url, email`)
        .eq('id', sessionData.user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    username,
    avatar_url,
  }: {
    username: string
    avatar_url: string
  }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        id: session.user.id,
        username,
        avatar_url,
        updated_at: new Date(),
      }

      let { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function sendReauthNonce() {
    if (!session?.user.email) throw new Error('No user on the session!')

    const email: string = session?.user.email
    const { error } = await supabase.auth.reauthenticate();
    Alert.alert(`Reset password email sent to ${email}`)

    if (error) throw error;
  };

async function updatePassword(nonce: string, newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
    nonce: nonce
  })

  Alert.alert(`Password successfully updated!`)


  if (error) throw error;
}

  return (
    
    <View style={styles.container}>
      <Avatar
          size={200}
          url={avatarUrl}
          onUpload={(url: string) => {
            setAvatarUrl(url)
            updateProfile({ username, avatar_url: url })
          }}
        />

      <View style={styles.verticallySpaced}>
      <Text lightColor="#000" darkColor="#eee">Username</Text>
        <TextInput placeholder="Username" value={username.toLowerCase() || ''} onChangeText={(text) => setUsername(text)} lightColor="#000" darkColor="#eee" />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? 'Loading ...' : 'Update'}
          onPress={() => updateProfile({ username,  avatar_url: avatarUrl })}
          disabled={loading}
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]} >
        <Button title="Reset Password" onPress={() => sendReauthNonce()} />
      </View>

      <View style={styles.verticallySpaced}>
      <TextInput placeholder="One Time Passcode (OTP)"  onChangeText={(text) => setNonce(text)} lightColor="#000" darkColor="#eee" />

      <TextInput placeholder="New Password"  onChangeText={(text) => setnewPassword(text)} lightColor="#000" darkColor="#eee" />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]} >
        <Button title="Update password" onPress={() => updatePassword(nonce, newPassword)} />
      </View>
      
    </View>

    
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  settingsInput: {
    color: 'green'
  }
})
