import React, { useState } from 'react';
import { useColorScheme, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Colors from '../constants/Colors';
import moment from 'moment';
import { View, Separator } from './Themed';

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
  startDay: Date | null;
  setStartDay: React.Dispatch<React.SetStateAction<Date | null>>;
  endDay: Date | null;
  setEndDay: React.Dispatch<React.SetStateAction<Date | null>>;
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
      
      const selectedDate = moment(day.dateString).toDate();

      if (startDay && !endDay) {
        const date: MarkedDatesType = {}
        for (const d = moment(startDay); d.isSameOrBefore(selectedDate); d.add(1, 'days')) {
          date[d.format('YYYY-MM-DD')] = {
            marked: true,
            color: 'black',
            textColor: 'white'
          };

          if(d.format('YYYY-MM-DD') === moment(startDay).format('YYYY-MM-DD')) {
            date[d.format('YYYY-MM-DD')].startingDay = true;
          } 
          if(d.format('YYYY-MM-DD') === day.dateString) {
            date[d.format('YYYY-MM-DD')].endingDay = true;
        }
        }

        setMarkedDates(date);
        setEndDay(selectedDate);
      } else {
        setStartDay(selectedDate)
        setEndDay(null)
        setMarkedDates({
          [moment(selectedDate).format('YYYY-MM-DD')]: {
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