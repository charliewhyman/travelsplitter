import { Link, router } from "expo-router";
import CalendarComponent from "../components/Calendar";
import { View } from "../components/Themed";
import { StatusBar } from "expo-status-bar";
import { Button } from "react-native-elements";
import { useState } from "react";

export default function CalendarModal() {
    // If the page was reloaded or navigated to directly, then the modal should be presented as
    // a full screen page. You may need to change the UI to account for this.
    const isPresented = router.canGoBack();
    const [startDay, setStartDay] = useState<string | null>(null);
    const [endDay, setEndDay] = useState<string | null>(null);

    function handleConfirmDatesClick() {
      console.log(startDay)
      console.log(endDay)
    }

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {/* Use `../` as a simple way to navigate to the root. This is not analogous to "goBack". */}
        {!isPresented && <Link href="../">Dismiss</Link>}
        {/* Native modals have dark backgrounds on iOS, set the status bar to light content. */}
        <CalendarComponent
          startDay={startDay}
          setStartDay={setStartDay}
          endDay={endDay}
          setEndDay={setEndDay}
        />
        <Button title='Confirm Dates' onPress={handleConfirmDatesClick}></Button>
        <StatusBar style="light" />
      </View>
    );
  }