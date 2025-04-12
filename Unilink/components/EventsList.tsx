import { useState, useEffect } from "react";
import { getAPI } from "@/app/_layout";
import EventBox, { EventTagData, EventInteractionsData } from "@/components/EventBox";
import { View } from "react-native";
import LoadingSpinner from "@/components/LoadingSpinner";
import { EventImagesMap } from "@/components/EventImages";

export type EventData = {
  imageSource: any;
  title: string;
  description: string;
  tags: EventTagData[];
  location: string;
  time: string;
  interactionData: EventInteractionsData;
};

type EventsData = Map<string, EventData>;

export type EventsListFilterOptions = {
  tagCategory?: string;
  searchTitle?: string;
};

type Props = {
  eventsAPIRoute: string;
  likeEventsAPIRoute?: string;
  rsvpEventsAPIRoute?: string;
  filterOptions?: EventsListFilterOptions
}

function convertEventTagsAPIData(eventTagsAPIData: any[]) {
  var result: EventTagData[] = [];

  for(var eventTagAPIData of eventTagsAPIData) {
    result.push({
      id: eventTagAPIData.tag_id,
      name: eventTagAPIData.tag_name,
      category: eventTagAPIData.classification,
      backgroundColor: eventTagAPIData.color,
    });
  }

  return result;
};

function convertEventTimeAPIData(eventTimeAPIData: string) {
  // example time returned by API: "2025-02-06T17:00:00.000Z"
  // transform to -> "Feb 6, 5 PM"

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

function convertEventsAPIData(eventsData: EventsData, eventsAPIData: any[],
setEventInteractions?: { like?: boolean, rsvp?: boolean } ) {
  for(var eventAPIData of eventsAPIData) {
    // const [likeSelected, setLikeSelected] = useState<boolean>(
    //   (setEventInteractions && setEventInteractions.like) ? setEventInteractions.like : false);
    
    // const [rsvpSelected, setRsvpSelected] = useState<boolean>(
    //   (setEventInteractions && setEventInteractions.rsvp) ? setEventInteractions.rsvp : false);

    var eventData: EventData = {
      imageSource: EventImagesMap.get(eventAPIData.poster_path),
      title: eventAPIData.title,
      description: eventAPIData.event_description,
      tags: convertEventTagsAPIData(eventAPIData.event_tags),
      location: eventAPIData.event_location,
      time: convertEventTimeAPIData(eventAPIData.event_time),
      interactionData: {
        like: {
          count: parseInt(eventAPIData.likes_count),
          selected: (setEventInteractions && setEventInteractions.like) ? setEventInteractions.like : false,
          //setSelected: setLikeSelected
        },
        rsvp: {
          count: parseInt(eventAPIData.rsvps_count),
          selected: (setEventInteractions && setEventInteractions.rsvp) ? setEventInteractions.rsvp : false,
          //setSelected: setRsvpSelected
        }
      }
    };

    eventsData.set(eventAPIData.event_id, eventData);
  };

  return eventsData;
}

function generateEventBoxes(eventsData: EventsData) {
  var result = [];

  for(var [eventId, eventData] of eventsData) {
    result.push(
      <EventBox
        key={eventId}
        imageSource={eventData.imageSource}
        eventText={{
          tags: eventData.tags,
          title: eventData.title,
          description: eventData.description,
          details: [
            // { key: "organization", iconSource: {evilIcon: "user"}, text: eventData.organization },
            { key: "location", iconSource: {evilIcon: "location"}, text: eventData.location },
            { key: "time", iconSource: {evilIcon: "clock"}, text: eventData.time }
          ]
        }}
        interactionData={eventData.interactionData}
      />
    );
  }

  return result;
};

function filterEventsByTagCategory(eventsData: EventsData, tagCategory: string) {
  var result = new Map();

  for(var [eventId, eventData] of eventsData) {
    for(var tagData of eventData.tags) {
      if(tagData.category === tagCategory) {
        result.set(eventId, eventData);
        break;
      }
    }
  }

  return result;
}

function filterEventsBySearchTitle(eventsData: EventsData, searchTitle: string) {
  var result = new Map();

  for(var [eventId, eventData] of eventsData) {
    if(eventData.title.toLowerCase().includes(searchTitle.toLowerCase())) result.set(eventId, eventData);
  }

  return result;
}

export default function EventsList({ eventsAPIRoute, likeEventsAPIRoute, rsvpEventsAPIRoute, filterOptions }: Props) {
  const [events, setEvents] = useState<EventsData>();

  useEffect(() => {
    const getEvents = async () => {
      const logAPIResponse = true;

      var eventsData: EventsData = new Map();
      const eventsResponse = await getAPI(eventsAPIRoute, logAPIResponse);
      if(eventsResponse) convertEventsAPIData(eventsData, eventsResponse.data);
      
      if(likeEventsAPIRoute) {
        const likeEventsResponse = await getAPI(likeEventsAPIRoute, logAPIResponse);
        if(likeEventsResponse) convertEventsAPIData(eventsData, likeEventsResponse.data, {like: true});
      }
      
      if(rsvpEventsAPIRoute) {
        const rsvpEventsResponse = await getAPI(rsvpEventsAPIRoute, logAPIResponse);
        if(rsvpEventsResponse) convertEventsAPIData(eventsData, rsvpEventsResponse.data, {rsvp: true});
      }

      setEvents(eventsData);
    }

    getEvents();
  }, [eventsAPIRoute, likeEventsAPIRoute, rsvpEventsAPIRoute]);

  var content: JSX.Element | JSX.Element[] = <LoadingSpinner scale={2} margin={50}/>;

  if(events) {
    if(filterOptions) {
      var filteredEvents = events;

      if(filterOptions.tagCategory) {
        filteredEvents = filterEventsByTagCategory(filteredEvents, filterOptions.tagCategory);
      }

      if(filterOptions.searchTitle && filterOptions.searchTitle != "") {
        filteredEvents = filterEventsBySearchTitle(filteredEvents, filterOptions.searchTitle);
      }

      content = generateEventBoxes(filteredEvents);
    } else content = generateEventBoxes(events);
  }

  return (
    <View>
      {content}
    </View>
  );
}