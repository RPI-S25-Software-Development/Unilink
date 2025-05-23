import { useState, useEffect } from "react";
import { getAPI, postAPI, deleteAPI } from "@/app/_layout";
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
  userSaved?: boolean;
};

type Props = {
  eventsAPIRoute: string;
  userId: string;
  filterOptions?: EventsListFilterOptions
}

export enum EventInteractionAPIRoutes {
  like = "/likes",
  rsvp = "/rsvps",
};

function EventInteractionDeleteAPIRoutes(interaction: keyof EventInteractionsData, eventId: string, userId: string) {
  return EventInteractionAPIRoutes[interaction] + "/eventId/" + eventId + "/userId/" + userId;
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

export function convertEventTimeAPIData(eventTimeAPIData: string) {
  // example time returned by API: "2025-02-06T17:00:00.000Z"
  // transform to -> "Feb 6, 5 PM"

  var date = new Date(eventTimeAPIData);

  const allMonths = new Map([
    [0, "Jan"],
    [1, "Feb"],
    [2, "Mar"],
    [3, "Apr"],
    [4, "May"],
    [5, "Jun"],
    [6, "Jul"],
    [7, "Aug"],
    [8, "Sep"],
    [9, "Oct"],
    [10, "Nov"],
    [11, "Feb"]
  ]);

  var [year, month, day, hour, minute, seconds] = [
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  ];

  var hourAdjusted = hour;
  var timePeriod = hourAdjusted < 12 ? "AM" : "PM";
  hourAdjusted = (hourAdjusted == 0) ? 12 : hourAdjusted;
  hourAdjusted = (hourAdjusted > 12) ? (hourAdjusted % 12) : hourAdjusted;

  var minuteString = minute < 10 ? "0" + minute.toString() : minute.toString();

  return allMonths.get(+month) + " " + day + ", " + hourAdjusted + ":" + minuteString + " " + timePeriod;
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
        interactionsData={eventData.interactionsData}
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
  };

  return result;
};

function filterEventsBySearchTitle(eventsData: EventsData, searchTitle: string) {
  var result = new Map();

  for(var [eventId, eventData] of eventsData) {
    if(eventData.title.toLowerCase().includes(searchTitle.toLowerCase())) result.set(eventId, eventData);
  };

  return result;
};

function filterEventsByUserSaved(eventsData: EventsData) {
  var result = new Map();

  for(var [eventId, eventData] of eventsData) {
    let interaction: keyof typeof eventData.interactionsData;
    for(interaction in eventData.interactionsData) {
      if(eventData.interactionsData[interaction].selected) {
        result.set(eventId, eventData);
        break;
      }
    }
  };

  return result;
}

function toggleEventInteractionState(eventId: string, interaction: keyof EventInteractionsData,
setEventsData: React.Dispatch<React.SetStateAction<EventsData | undefined>>,
setRerender: React.Dispatch<React.SetStateAction<boolean>>) {
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
setEventsData: React.Dispatch<React.SetStateAction<EventsData | undefined>>,
setRerender: React.Dispatch<React.SetStateAction<boolean>>) {
  eventsData.entries().forEach(([eventId, eventData]) => {
      (Object.keys(eventData.interactionsData) as Array<keyof typeof eventData.interactionsData>).forEach(
        (interaction) => {
          eventData.interactionsData[interaction].buttonOnPress =
            (async () => {
              toggleEventInteractionState(eventId, interaction, setEventsData, setRerender);

              if(eventData.interactionsData[interaction].selected) {
                await postAPI(EventInteractionAPIRoutes[interaction], {user_id: userId, event_id: eventId});
              } else {
                await deleteAPI(EventInteractionDeleteAPIRoutes(interaction, eventId, userId));
              };

              setRerender((previousValue) => !previousValue);
            });
          }
      );
    }
  );
};

export default function EventsList({ eventsAPIRoute, userId, filterOptions }: Props) {
  const [allEvents, setAllEvents] = useState<EventsData>();
  const [rerender, setRerender] = useState<boolean>(false);

  useEffect(() => {
    const getEvents = async () => {
      const logAPIResponse = false;

      var eventsData: EventsData = new Map();
      const eventsResponse = await getAPI(eventsAPIRoute, logAPIResponse);
      if(eventsResponse) convertEventsAPIData(eventsData, eventsResponse.data);
      
      setEventInteractionCallables(eventsData, userId, setAllEvents, setRerender);

      setAllEvents(eventsData);
    };

    getEvents();
  }, [rerender]);

  var content = allEvents ? generateEventBoxes(allEvents) : <LoadingSpinner scale={2} margin={50}/>;

  if(allEvents && filterOptions) {
    var filteredEvents = allEvents;

    if(filterOptions.tagCategory) {
      filteredEvents = filterEventsByTagCategory(filteredEvents, filterOptions.tagCategory);
    }

    if(filterOptions.searchTitle && filterOptions.searchTitle != "") {
      filteredEvents = filterEventsBySearchTitle(filteredEvents, filterOptions.searchTitle);
    }

    if(filterOptions.userSaved) {
      filteredEvents = filterEventsByUserSaved(filteredEvents);
    }

    content = generateEventBoxes(filteredEvents);
  }

  return (
    <View>
      {content}
    </View>
  );
}