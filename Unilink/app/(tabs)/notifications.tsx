import { ScrollView } from "react-native";
import HeaderText from "@/components/HeaderText";
import { EventImagesMap } from "@/components/EventImages";
import EventNotificationBox, { EventNotificationType } from "@/components/EventNotificationBox";
import { EventTextProps } from "@/components/EventBox";
import EventNotificationsList from "@/components/EventNotificationsList";
import { useState, useEffect } from "react";
import { getFromStorage } from "../_layout";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Redirect } from "expo-router";

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
  const [userId, setUserId] = useState<string>();

  var content = <LoadingSpinner scale={2} margin="5%"/>;

  useEffect(() => {
    const getUserId = async () => {
      const userIdResponse = await getFromStorage("user_id");
      if(userIdResponse) setUserId(userIdResponse);
    };

    getUserId();
  }, []);

  if(userId) {
    if(userId === null) return <Redirect href="/login"/>;
    content = <EventNotificationsList notificationsAPIRoute={"/notifications/userId/" + userId}/>
  }

  return (
    <ScrollView className="flex flex-col items-center">
      <HeaderText fontSize={32} className="m-5">Your Notifications</HeaderText>
      {content}
      {/* <EventNotificationBox key={PlaceholderEventId} imageSource={PlaceholderEventImage}
      eventText={PlaceholderEventText} notificationType={EventNotificationType.reminder24H}/>
      <EventNotificationBox key={PlaceholderEventId} imageSource={PlaceholderEventImage}
      eventText={PlaceholderEventText} notificationType={EventNotificationType.reminder24H}/>
      <EventNotificationBox key={PlaceholderEventId} imageSource={PlaceholderEventImage}
      eventText={PlaceholderEventText} notificationType={EventNotificationType.reminder24H}/>
      <EventNotificationBox key={PlaceholderEventId} imageSource={PlaceholderEventImage}
      eventText={PlaceholderEventText} notificationType={EventNotificationType.reminder24H}/>
      <EventNotificationBox key={PlaceholderEventId} imageSource={PlaceholderEventImage}
      eventText={PlaceholderEventText} notificationType={EventNotificationType.reminder24H}/> */}
    </ScrollView>
  );
}