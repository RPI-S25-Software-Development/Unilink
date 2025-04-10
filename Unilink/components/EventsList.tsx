import { useState, useEffect } from "react";
import { getAPIData, getUserId } from "@/app/_layout";
import EventBox from "@/components/EventBox";
import { View } from "react-native";
import LoadingSpinner from "./LoadingSpinner";

type Props = {
  eventsApiRoute: string;
}

function convertEventTagsAPIData(eventTagsAPIData: any[]) {
  var result = [];

  for(var eventTagAPIData of eventTagsAPIData) {
    result.push({
      backgroundColor: eventTagAPIData.color,
      name: eventTagAPIData.tag_name
    });
  }

  return result;
};

function convertEventTimeAPIData(eventTimeAPIData: string) {
  var sampleTime = "2025-02-06T17:00:00.000Z";

  var [date, time] = eventTimeAPIData.split("T");
  time = time.split(".")[0];

  const allMonths = new Map([
    [1, "Jan"],
    [2, "Feb"],
    [3, "Mar"],
    [4, "Apr"],
    [5, "May"],
    [6, "Jun"],
    [7, "Jul"],
    [8, "Aug"],
    [9, "Sep"],
    [10, "Oct"],
    [11, "Nov"],
    [12, "Feb"]
  ]);

  var [year, month, day] = date.split("-");
  var [hour, minute, seconds] = time.split(":");

  var hourAdjusted = parseInt(hour);
  var timePeriod = hourAdjusted < 12 ? "AM" : "PM";
  hourAdjusted = (hourAdjusted == 0) ? 12 : hourAdjusted;
  hourAdjusted = (hourAdjusted > 12) ? (hourAdjusted % 12) : hourAdjusted;

  return allMonths.get(+month) + " " + day + ", " + hourAdjusted + ":" + minute + " " + timePeriod;
}

function eventsAPIDataToComponent(eventsAPIData: any[]) {
  var result = [];

  for(var eventAPIData of eventsAPIData) {
    result.push(
    <EventBox
      key={eventAPIData.event_id}
      imageSource={{uri: "@/assets/images/" + eventAPIData.poster_path}}
      eventText={{
        tags: convertEventTagsAPIData(eventAPIData.event_tags),
        title: eventAPIData.title, description: eventAPIData.event_description,
        details: [
          // { key: "organization", iconSource: {evilIconName: "user"},
          // text: "eventAPIData.organization_name" },
          { key: "location", iconSource: {evilIconName: "location"},
          text: eventAPIData.event_location },
          { key: "time", iconSource: {evilIconName: "clock"},
          text: convertEventTimeAPIData(eventAPIData.event_time) }
        ]
      }}
      interactionCounts={{
        likeCount: parseInt(eventAPIData.likes_count),
        rsvpCount: parseInt(eventAPIData.rsvps_count)
      }}
    />);
  }

  return result;
};

export default function EventsList({ eventsApiRoute }: Props) {
  const [userId, setUserId] = useState<string>();
  const [events, setEvents] = useState<any[]>();

  var content = events ? eventsAPIDataToComponent(events) : <LoadingSpinner scale={2} margin={50}/>;

  useEffect(() => {
      getUserId().then((userIdResponse) => {
        if(userIdResponse) {
          setUserId(userIdResponse);

          getAPIData(eventsApiRoute).then((eventsResponse) => {
            if(eventsResponse) setEvents(eventsResponse);
          });
        };
      });
  }, []);

  return (
    <View>
      {content}
    </View>
  );
}