import { useState, useEffect } from "react";
import { getAPI } from "@/app/_layout";
import EventBox from "@/components/EventBox";
import { View } from "react-native";
import LoadingSpinner from "@/components/LoadingSpinner";
import { EventImagesMap } from "@/components/EventImages";

type Props = {
  eventsAPIRoute: string;
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
      imageSource={EventImagesMap.get(eventAPIData.poster_path)}
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

export default function EventsList({ eventsAPIRoute }: Props) {
  const [events, setEvents] = useState<any[]>();

  var content = events ? eventsAPIDataToComponent(events) : <LoadingSpinner scale={2} margin={50}/>;

  useEffect(() => {
    const getEvents = async () => {
      const eventsResponse = await getAPI(eventsAPIRoute);
      if(eventsResponse) setEvents(eventsResponse.data);
    }

    getEvents();
  }, [eventsAPIRoute]);

  return (
    <View>
      {content}
    </View>
  );
}