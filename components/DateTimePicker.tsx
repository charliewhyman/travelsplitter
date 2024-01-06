import { useState } from "react";
import { DateTimePickerAndroid, AndroidNativeProps } from "@react-native-community/datetimepicker"
import { Text, View } from "./Themed";
import { Button } from "react-native-elements";

type AndroidMode = 'date' | 'time';

export const DateTimePicker = () => {
  const [date, setDate] = useState(new Date());

  const onChange = (event: Event, selectedDate: Date) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showMode = (currentMode: AndroidMode) => {
    DateTimePickerAndroid.open({
      value: date,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <View>
      <Button onPress={showDatepicker} title="Show date picker!" />
      <Button onPress={showTimepicker} title="Show time picker!" />
      <Text>selected: {date.toLocaleString()}</Text>
    </View>
  );
};