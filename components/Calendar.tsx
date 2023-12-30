import React, { useState } from 'react';
import { useColorScheme } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Colors from '../constants/Colors';
import moment from 'moment';

type MarkedDatesType = {
  [date: string]: {
    marked: boolean;
    color: string;
    textColor: string;
    startingDay?: boolean;
    endingDay?: boolean;
  };
};

export default function CalendarComponent() {
  const [startDay, setStartDay] = useState<string | null>(null);
  const [endDay, setEndDay] = useState<string | null>(null);
  const [markedDates, setMarkedDates] = useState<MarkedDatesType>({});

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
        onDayPress={(day) => {
          if (startDay && !endDay) {
            const date: MarkedDatesType = {}
            for (const d = moment(startDay); d.isSameOrBefore(day.dateString); d.add(1, 'days')) {
              date[d.format('YYYY-MM-DD')] = {
                marked: true,
                color: 'black',
                textColor: 'white'
              };

              if(d.format('YYYY-MM-DD') === startDay) date[d.format('YYYY-MM-DD')].startingDay = true;
              if(d.format('YYYY-MM-DD') === day.dateString) date[d.format('YYYY-MM-DD')].endingDay = true;
            }

            setMarkedDates(date);
            setEndDay(day.dateString);
          } else {
            setStartDay(day.dateString)
            setEndDay(null)
            setMarkedDates({
              [day.dateString]: {
                marked: true,
                color: 'black',
                textColor: 'white',
                startingDay: true,
                endingDay: true
              }
            })
          }
        }}
        monthFormat={"yyyy MMM"}
        hideDayNames={false}
        markingType={'period'}
        markedDates={markedDates}
      />
    );
};