import { StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Text, View } from '../../components/Themed';

export default function Group() {
    const { slug } = useLocalSearchParams();
    return (
        <View>
          <Stack.Screen
        options={{title: `Group: ${slug}`
        }}
        />
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
  
