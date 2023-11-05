import { StyleSheet } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Text, TextInput, View } from '../../components/Themed';
import React, { useState } from 'react';
import { Button } from 'react-native-elements';

export default function Group() {
    const { slug } = useLocalSearchParams();
    const navigation = useNavigation();
    const [newUser, setNewUser] = useState<string | null>('')

    React.useEffect(() => {
          navigation.setOptions({
            headerShown: false,
            title: `Group: ${slug}`
          });
        }, [navigation]);
    
    return (
        <View style={styles.container}>
          <Text style={styles.title}>{slug}</Text>
          <View style={[styles.verticallySpaced, styles.mt20]} >
              <Text>Add Group Member</Text>
              <TextInput placeholder='Username' onChangeText={(text) => setNewUser(text)} lightColor="#000" darkColor="#eee"></TextInput>
                <Button title="Add user" onPress={() => console.log(newUser)} />
            </View>
        </View>
        


    )
};
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: '80%',
    },
    verticallySpaced: {
      paddingTop: 4,
      paddingBottom: 4,
      alignSelf: 'stretch',
    },
    mt20: {
      marginTop: 20,
    },
  });
  
