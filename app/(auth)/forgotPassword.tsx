import { Alert, Button, StyleSheet } from "react-native"
import { Text, TextInput, View } from "../../components/Themed"
import { useState } from "react"
import { supabase } from "../lib/supabase"


export default function ForgotPassword() {
    const [email, setEmail] = useState('') 
    const [loading, setLoading] = useState(false)

    async function resetPassword() {
        setLoading(true)
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: '(auth)/login',
          })
    
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