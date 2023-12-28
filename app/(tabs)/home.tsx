import { StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import React from 'react';
import Trips from '../../components/Trips';
import { Button } from 'react-native-elements';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Button title='+ Add Trip' onPress={() => router.push('/newTrip/newTrip')}></Button>
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
