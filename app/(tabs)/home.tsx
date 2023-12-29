import { StyleSheet } from 'react-native';
import { Separator, Text, View } from '../../components/Themed';
import React from 'react';
import Trips from '../../components/Trips';
import { Button } from 'react-native-elements';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Separator style={styles.separator}/>
        <Button title='+ Add Trip' onPress={() => router.push('/newTrip/newTrip')}></Button>
        <Separator style={styles.separator}/>
        <Trips />
      </View>
  );
}

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
  }
});
