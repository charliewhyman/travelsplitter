import { Alert, Button, StyleSheet } from "react-native"
import { Text, TextInput, View } from "../../components/Themed"
import { useState } from "react"
import { supabase } from "../lib/supabase"
import { router } from "expo-router"


export default function ForgotPassword() {
    const [email, setEmail] = useState('') 
    const [loading, setLoading] = useState(false)

    async function resetPassword() {
        setLoading(true)
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: 'exp://192.168.1.125:8081/--/%28tabs%29/settings'
        }
        )

        Alert.alert(`Password reset link sent to ${email}`)
        
    
        if (error) Alert.alert(error.message)
        setLoading(false)
      }


    return (
        <View style={styles.container}>
            <View style={[styles.verticallySpaced]}>
              <TextInput style={styles.TextInput}
                onChangeText={(text) => setEmail(text)}
                value={email}
                placeholder="email@address.com"
                autoCapitalize={'none'}
                inputMode='email'
              />
            </View>
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Button title="Reset Password" disabled={loading} onPress={() => resetPassword()} />
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
    TextInput: {
      borderColor: '#ffffff',
      color: '#d3d3d3',
      borderRadius: 4,
      borderStyle: 'solid',
      borderWidth: 1,
      padding: 12,
      margin: 8
    }
  })