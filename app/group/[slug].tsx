import { StyleSheet } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Text, View } from '../../components/Themed';
import React from 'react';

export default function Group() {
    const { slug } = useLocalSearchParams();
    const navigation = useNavigation();

    React.useEffect(() => {
          navigation.setOptions({
            headerShown: false,
            title: `Group: ${slug}`
          });
        }, [navigation]);
    
    return (
        <View>
          <Text style={styles.title}>Selected group: {slug}</Text>
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
    }
  });
  
