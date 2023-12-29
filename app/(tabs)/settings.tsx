import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, Alert } from 'react-native'
import { Button } from 'react-native-elements'
import { Session } from '@supabase/supabase-js'
import Avatar from '../../components/Avatar'
import { View, TextInput, Text, Separator } from '../../components/Themed'
import { router } from 'expo-router'
import { fetchSession } from '../helpers/tripHandler'

export default function Account() {
  const [loading, setLoading] = useState<boolean>(true)
  const [username, setUsername] = useState<string | null>('')
  const [nonce, setNonce] = useState<string | null>('')
  const [newPassword, setnewPassword] = useState<string | null>('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>('')
  const [session, setSession] = useState<Session | null>(null)
  const [showResetPasswordFields, setShowResetPasswordFields] = useState<boolean>(false);

  useEffect(() => {
    getProfile()
  }, [])

  async function getProfile() {

    try {
      setLoading(true)
      const sessionData = await fetchSession();

      if (sessionData) {
        setSession(sessionData);

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
        username,
        avatar_url,
        updated_at: new Date().toISOString(),
      }

      let { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', session.user.id)

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
    if (!session?.user.email) throw new Error('No user on the session! (settings.tsx)')

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

const handleResetPasswordPress = async () => {
  await sendReauthNonce();

  setShowResetPasswordFields(true);
};

  return (
    <View style={[styles.container, styles.flexCenter]}>
      <Avatar
          size={175}
          url={avatarUrl || ""}
          onUpload={(url: string) => {
            setAvatarUrl(url)
            updateProfile({ username: username || "", avatar_url: url || "" })
          }}
        />

      <View style={styles.verticallySpaced}>
      <Text>Username</Text>
        <TextInput style={styles.mt5} placeholder="Username" value={username?.toLowerCase() || ''} onChangeText={(text) => setUsername(text)}/>
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? 'Loading ...' : 'Update'}
          onPress={() => updateProfile({ username: username || "", avatar_url: avatarUrl || "" })}
          disabled={loading}
        />
      </View>
      <Separator></Separator>
      <View style={[styles.verticallySpaced]} >
        <Button title="Reset Password" onPress={() => handleResetPasswordPress()} />
      </View>

      {showResetPasswordFields && (
    
      <View style={[styles.verticallySpaced, styles.mt20]}>
      <TextInput placeholder="One Time Passcode (OTP)"  onChangeText={(text) => setNonce(text)}/>

      <TextInput style={styles.mt5} placeholder="New Password"  onChangeText={(text) => setnewPassword(text)}/>
      <View style={[styles.verticallySpaced, styles.mt5]} >
        <Button title="Update password" onPress={() => updatePassword( nonce || '', newPassword || '' )} />
      </View>
      </View>
      )}

      <View style={styles.verticallySpaced}>
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
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
  mt5: {
    marginTop: 5
  },
  settingsInput: {
    color: 'green'
  },
  flexCenter: {
    display: 'flex',
    alignItems: 'center'
  }
})
