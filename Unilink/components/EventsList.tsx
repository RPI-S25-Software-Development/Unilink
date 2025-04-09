import EventBox from "@/components/EventBox";
import { EventTagProps } from "@/components/EventBox";

type Props = {
  eventsApiRoute: string;
}

function convertEventTagsAPIData(eventTagsAPIData: any[]) {
  var result: EventTagProps[] = [];

  for(var eventTagAPIData of eventTagsAPIData) {
    result.push({
      backgroundColor: eventTagAPIData.color,
      name: eventTagAPIData.tag_name
    });
  }

  return result;
};

function eventAPIDataToComponent(eventAPIData: any,
eventTagsAPIData: any[],
eventOrganizationName: string) {
  return (
    <EventBox
      imageSource={require("@/assets/images/" + eventAPIData.poster_path)}
      eventText={{
        tags: convertEventTagsAPIData(eventTagsAPIData),
        title: eventAPIData.title, description: eventAPIData.event_description,
        details: [
          { key: "organization", iconSource: {evilIconName: "user"}, text: eventOrganizationName },
          { key: "location", iconSource: {evilIconName: "location"},
          text: eventAPIData.event_location },
          { key: "time", iconSource: {evilIconName: "clock"}, text: eventAPIData.event_time }
        ]
      }}
      interactionCounts={{
        likeCount: 42,
        rsvpCount: 28
      }}
    />
  )
};

export default function EventsList({ eventsApiRoute }: Props) {

}