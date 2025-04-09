import EventBox from "@/components/EventBox";
import { EventTagProps } from "@/components/EventBox";

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

  return allMonths.get(+month) + " " + day + ", " + hour + ":" + minute;
}

function eventAPIDataToComponent(eventsAPIData: any[]) {
  var result = [];

  for(var eventAPIData of eventsAPIData) {
    result.push(
    <EventBox
      imageSource={require("@/assets/images/" + eventAPIData.poster_path)}
      eventText={{
        tags: convertEventTagsAPIData(eventAPIData.event_tags),
        title: eventAPIData.title, description: eventAPIData.event_description,
        details: [
          { key: "organization", iconSource: {evilIconName: "user"},
          text: eventAPIData.organization_name },
          { key: "location", iconSource: {evilIconName: "location"},
          text: eventAPIData.event_location },
          { key: "time", iconSource: {evilIconName: "clock"},
          text: convertEventTimeAPIData(eventAPIData.event_time) }
        ]
      }}
      interactionCounts={{
        likeCount: eventAPIData.event_likes,
        rsvpCount: eventAPIData.event_rsvps
      }}
    />);
  }

  return result;
};

export default function EventsList({ eventsApiRoute }: Props) {

}