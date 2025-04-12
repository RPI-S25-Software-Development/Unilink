import { useState, useEffect } from "react";
import { getAPI, postAPI, getFromStorage } from "@/app/_layout";
import EventBox, { EventTagData, EventInteractionsData, EventInteractionData } from "@/components/EventBox";
import { View } from "react-native";
import LoadingSpinner from "@/components/LoadingSpinner";
import { EventImagesMap } from "@/components/EventImages";

export type EventData = {
  id: string;
  imageSource: any;
  title: string;
  description: string;
  tags: EventTagData[];
  location: string;
  time: string;
  interactionsData: EventInteractionsData;
};

type EventsData = Map<string, EventData>;

export type EventsListFilterOptions = {
  tagCategory?: string;
  searchTitle?: string;
};

type Props = {
  eventsAPIRoute: string;
  userId: string;
  filterOptions?: EventsListFilterOptions
}

export enum EventInteractionAPIRoutes {
  like = "/likes/",
  rsvp = "/rsvps/"
};

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
};

function convertEventsAPIData(eventsData: EventsData, eventsAPIData: any[]) {
  for(var eventAPIData of eventsAPIData) {
    var eventData: EventData = {
      id: eventAPIData.event_id,
      imageSource: EventImagesMap.get(eventAPIData.poster_path),
      title: eventAPIData.title,
      description: eventAPIData.event_description,
      tags: convertEventTagsAPIData(eventAPIData.event_tags),
      location: eventAPIData.event_location,
      time: convertEventTimeAPIData(eventAPIData.event_time),
      interactionsData: {
        like: {
          count: parseInt(eventAPIData.likes_count),
          selected: eventAPIData.like_selected
        },
        rsvp: {
          count: parseInt(eventAPIData.rsvps_count),
          selected: eventAPIData.rsvp_selected
        }
      }
    };

    eventsData.set(eventAPIData.event_id, eventData);
  };

  return eventsData;
};

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
        interactionData={eventData.interactionsData}
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
};

function filterEventsBySearchTitle(eventsData: EventsData, searchTitle: string) {
  var result = new Map();

  for(var [eventId, eventData] of eventsData) {
    if(eventData.title.toLowerCase().includes(searchTitle.toLowerCase())) result.set(eventId, eventData);
  }

  return result;
};

function toggleEventInteractionState(eventId: string, interaction: keyof EventInteractionsData,
  setEventsData: React.Dispatch<React.SetStateAction<EventsData | undefined>>) {
    setEventsData((eventsData) => {
      var newEventsData = new Map(eventsData);
      var eventData = newEventsData.get(eventId);
  
      if(eventData) {
        var interactionSelected = eventData.interactionsData[interaction].selected

        eventData.interactionsData[interaction].count += interactionSelected ? -1 : 1;
        
        eventData.interactionsData[interaction].selected = !interactionSelected;
        newEventsData.set(eventId, eventData);
      }
      
      return newEventsData;
    });
  }

function setEventInteractionCallables(eventsData: EventsData, userId: string,
setEventsData: React.Dispatch<React.SetStateAction<EventsData | undefined>>) {
  eventsData.entries().forEach(([eventId, eventData]) => {
      (Object.keys(eventData.interactionsData) as Array<keyof typeof eventData.interactionsData>).forEach(
        (interaction) => {
          eventData.interactionsData[interaction].buttonOnPress =
            (async () => {
              toggleEventInteractionState(eventId, interaction, setEventsData);

              if(eventData.interactionsData[interaction].selected) {
                await postAPI(EventInteractionAPIRoutes[interaction], {user_id: userId, event_id: eventId})
              }
            });
          }
      );
    }
  );
}

export default function EventsList({ eventsAPIRoute, userId, filterOptions }: Props) {
  const [allEvents, setAllEvents] = useState<EventsData>();

  useEffect(() => {
    const getEvents = async () => {
      const logAPIResponse = false;

      var eventsData: EventsData = new Map();
      const eventsResponse = await getAPI(eventsAPIRoute, logAPIResponse);
      if(eventsResponse) convertEventsAPIData(eventsData, eventsResponse.data);
      
      setEventInteractionCallables(eventsData, userId, setAllEvents);

      setAllEvents(eventsData);
    }

    getEvents();
  }, [eventsAPIRoute, allEvents]);

  var content = allEvents ? generateEventBoxes(allEvents) : <LoadingSpinner scale={2} margin={50}/>;

  if(allEvents && filterOptions) {
    var filteredEvents = allEvents;

    if(filterOptions.tagCategory) {
      filteredEvents = filterEventsByTagCategory(filteredEvents, filterOptions.tagCategory);
    }

    if(filterOptions.searchTitle && filterOptions.searchTitle != "") {
      filteredEvents = filterEventsBySearchTitle(filteredEvents, filterOptions.searchTitle);
    }

    content = generateEventBoxes(filteredEvents);
  }

  return (
    <View>
      {content}
    </View>
  );
}