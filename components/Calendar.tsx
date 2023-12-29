import React, { useState } from 'react';
import { useColorScheme } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Colors from '../constants/Colors';

export default function CalendarComponent() {
    const [selected, setSelected] = useState('');

    const colorScheme = useColorScheme();
    const textColor = Colors[colorScheme ?? 'light'].text

    return (
      <Calendar
      theme={{
        calendarBackground: 'transparent',
        monthTextColor: textColor,
        textSectionTitleColor: textColor,
        selectedDayBackgroundColor: '#00adf5',
        selectedDayTextColor: '#ffffff',
        todayTextColor: '#00adf5',
        dayTextColor: textColor,
        textDisabledColor: '#808080',
      }}
        onDayPress={day => {
          setSelected(day.dateString);
        }}
        markedDates={{
          [selected]: {selected: true, disableTouchEvent: true}
        }}
      />
    );
};