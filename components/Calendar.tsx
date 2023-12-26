import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function CalendarPicker() {
    const [selectedDate, setSelectedDate] = useState<string>('');

    const onDayPress = (day: { dateString: React.SetStateAction<string>; }) => {
      setSelectedDate(day.dateString);
    };

    return (
        <View style={styles.container}>
          <Calendar
            onDayPress={onDayPress}
            markedDates={{ [selectedDate]: { selected: true, marked: true } }}
          />
        </View>
      );
    };


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
});