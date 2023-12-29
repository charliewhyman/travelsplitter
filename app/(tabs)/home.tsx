import { StyleSheet } from 'react-native';
import { View } from '../../components/Themed';
import React from 'react';
import Trips from '../../components/Trips';
import { Button } from 'react-native-elements';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={[styles.verticallySpaced, styles.container]}>
        <Trips/>
        <Button title='+ Add Trip' buttonStyle={styles.mt10} onPress={() => router.push('/newTrip/newTrip')}></Button>
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
  },
  verticallySpaced: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt10: {
    marginTop: 10,
  },
});
