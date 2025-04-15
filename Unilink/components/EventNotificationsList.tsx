import EventNotificationBox, { EventNotificationType } from "./EventNotificationBox";
import { EventImagesMap } from "./EventImages";
import { convertEventTimeAPIData } from "./EventsList";
import { useState, useEffect } from "react";
import { getAPI } from "@/app/_layout";
import LoadingSpinner from "./LoadingSpinner";
import { View } from "react-native";
import HeaderText from "./HeaderText";

function generateEventNotifications(notificationsAPIData: any[]) {
    var result = [];

    for(var notificationAPIData of notificationsAPIData) {
        result.push(
            <EventNotificationBox key={notificationAPIData.event_id}
            imageSource={EventImagesMap.get(notificationAPIData.poster_path)}
            eventText={{
                tags: [],
                title: notificationAPIData.title,
                description: notificationAPIData.description,
                details: [
                // { key: "organization", iconSource: {evilIcon: "user"}, text: notificationAPIData.organization_name },
                { key: "location", iconSource: {evilIcon: "location"}, text: notificationAPIData.event_location },
                { key: "time", iconSource: {evilIcon: "clock"},
                text: convertEventTimeAPIData(notificationAPIData.event_time) }
                ]
            }} notificationType={EventNotificationType.reminder24H}/>
        )
    };

    return result;
};

type Props = {
    notificationsAPIRoute: string;
}

export default function EventNotificationsList({ notificationsAPIRoute }: Props) {
    const [notificationsData, setNotificationsData] = useState<any[]>();

    useEffect(() => {
        const getNotifications = async () => {
            const logAPIResponse = false;

            const notificationsResponse = await getAPI(notificationsAPIRoute, logAPIResponse);
            if(notificationsResponse) setNotificationsData(notificationsResponse.data);
        };

        getNotifications();
    }, []);

    var content: JSX.Element | JSX.Element[] = <LoadingSpinner scale={2} margin={50}/>

    if(notificationsData) {
        content = generateEventNotifications(notificationsData);
        if(content.length == 0) {
            content = <HeaderText fontSize={24} fontBold={false}>No notifications to display.</HeaderText>
        };
    };

    return (
        <View>
            {content}
        </View>
    );
};