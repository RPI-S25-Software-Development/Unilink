import { ScrollView } from "react-native";
import HeaderText from "@/components/HeaderText";
import RoundedBox from "@/components/RoundedBox";
import { EventImagesMap } from "@/components/EventImages";
import EventNotificationBox, { EventNotificationType } from "@/components/EventNotificationBox";
import { EventTextProps } from "@/components/EventBox";

const PlaceholderEventId = "a1f1e90b-0001-4b00-b001-000000000001.png";
const PlaceholderEventImage = EventImagesMap.get(PlaceholderEventId);
const PlaceholderEventText: EventTextProps = {
  tags: [],
  title: "Event",
  description: "Event Description",
  details: [
    // { key: "organization", iconSource: {evilIcon: "user"}, text: eventData.organization },
    { key: "location", iconSource: {evilIcon: "location"}, text: "Event Location" },
    { key: "time", iconSource: {evilIcon: "clock"}, text: "Event Time" }
  ]
};

export default function NotificationsScreen() {
  return (
    <ScrollView className="flex flex-col items-center">
      <HeaderText fontSize={32} className="m-5">Your Notifications</HeaderText>
      <EventNotificationBox key={PlaceholderEventId} imageSource={PlaceholderEventImage}
      eventText={PlaceholderEventText} notificationType={EventNotificationType.reminder24H}/>
      <EventNotificationBox key={PlaceholderEventId} imageSource={PlaceholderEventImage}
      eventText={PlaceholderEventText} notificationType={EventNotificationType.reminder24H}/>
      <EventNotificationBox key={PlaceholderEventId} imageSource={PlaceholderEventImage}
      eventText={PlaceholderEventText} notificationType={EventNotificationType.reminder24H}/>
      <EventNotificationBox key={PlaceholderEventId} imageSource={PlaceholderEventImage}
      eventText={PlaceholderEventText} notificationType={EventNotificationType.reminder24H}/>
      <EventNotificationBox key={PlaceholderEventId} imageSource={PlaceholderEventImage}
      eventText={PlaceholderEventText} notificationType={EventNotificationType.reminder24H}/>
    </ScrollView>
  );
}