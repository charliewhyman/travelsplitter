import { Link, router } from "expo-router";
import CalendarListComponent from "../components/CalendarList";
import { View } from "../components/Themed";
import { StatusBar } from "expo-status-bar";

export default function CalendarModal() {
    // If the page was reloaded or navigated to directly, then the modal should be presented as
    // a full screen page. You may need to change the UI to account for this.
    const isPresented = router.canGoBack();
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {/* Use `../` as a simple way to navigate to the root. This is not analogous to "goBack". */}
        {!isPresented && <Link href="../">Dismiss</Link>}
        {/* Native modals have dark backgrounds on iOS, set the status bar to light content. */}
        <CalendarListComponent/>
        <StatusBar style="light" />
      </View>
    );
  }