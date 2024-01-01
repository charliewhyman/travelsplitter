import React, { useState } from 'react';
import { useColorScheme, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Colors from '../constants/Colors';
import moment from 'moment';
import { View, Text, Separator } from './Themed';

export type MarkedDatesType = {
  [date: string]: {
    marked: boolean;
    color: string;
    textColor: string;
    startingDay?: boolean;
    endingDay?: boolean;
  };
};

interface CalendarComponentProps {
  startDay: string | null;
  setStartDay: React.Dispatch<React.SetStateAction<string | null>>;
  endDay: string | null;
  setEndDay: React.Dispatch<React.SetStateAction<string | null>>;
}


export default function CalendarComponent({
  startDay,
  setStartDay,
  endDay,
  setEndDay,
}: CalendarComponentProps) {
  
  const [markedDates, setMarkedDates] = useState<MarkedDatesType>({});

    const colorScheme = useColorScheme();
    const textColor = Colors[colorScheme ?? 'light'].text


    function handleDayPress(day: { dateString: string; }) {
      
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
    }

    return (
      <View>
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
            onDayPress={(day) => {handleDayPress(day)}}
            monthFormat={"yyyy MMM"}
            hideDayNames={false}
            markingType={'period'}
            markedDates={markedDates}
        />
        <Separator style={styles.separator}/>
        <Text>Start date: {startDay}</Text>
        <Text>End Date: {endDay}</Text>
        <Separator style={styles.separator}/>
      </View>
    );
};

const styles = StyleSheet.create({
  separator: {
    marginVertical: 10,
    height: 1,
    width: "80%",
  },
})