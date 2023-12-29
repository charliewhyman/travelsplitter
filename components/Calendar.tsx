import { Moment } from 'moment';
import React, { useState } from 'react';
import {
  StyleSheet
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { View, Text } from './Themed';

export default function Calendar() {
  const [selectedStartDate, setSelectedStartDate] = useState<Moment | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Moment | null>(null);

  const onDateChange = (date: Moment | null, type: string) => {
    if (type === 'END_DATE') {
      setSelectedEndDate(date);
    } else {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    }
  }

  const minDate = new Date();
  const maxDate = new Date(Date() + 365);
  const startDate = selectedStartDate ? selectedStartDate.toString() : '';
  const endDate = selectedEndDate ? selectedEndDate.toString() : '';

  return (
    <View style={styles.container}>
      <CalendarPicker 
        startFromMonday={true}
        allowRangeSelection={true}
        minDate={minDate}
        maxDate={maxDate}
        todayBackgroundColor="#f2e6ff"
        selectedDayColor="#7300e6"
        selectedDayTextColor="#FFFFFF"
        onDateChange={onDateChange}
      />

      <View>
        <Text>Trip start date:{startDate}</Text>
        <Text>Trip end date:{endDate}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
  },
});