import { DeliveredNotificationProps } from './Home'

export type RootStackParamList = {
    Home: {
        name: string
    };
    Login: undefined;
    Notification: {
        props: DeliveredNotificationProps
    };
    Profile: {
        name: string
    };
};