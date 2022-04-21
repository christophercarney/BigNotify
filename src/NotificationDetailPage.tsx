import React from 'react'
import { SafeAreaView, View, Text } from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './RootStackParams';
import { DeliveredNotificationProps } from './Home';
import { styles } from './styles'


type notificationScreenProp = StackNavigationProp<RootStackParamList, 'Notification'>;

function getBaseComponent(props: DeliveredNotificationProps) {
    return (
        <View>
              <Text style={styles.info}>
                {`OS: ${props.operatingSystem}`} 
              </Text>
              <Text style={styles.info}>
                {`Backend: ${props.backend}`} 
              </Text>
              <Text style={styles.info}>
                {`UUID: ${props.uuid}`} 
              </Text>
              <Text style={styles.info}>
                {`Lineage: ${props.lineage}`}
              </Text>
              <Text style={styles.info}>
                {`Data: ${props.data}`} 
              </Text>
        </View>
    );
}

function getAlertComponent(props: DeliveredNotificationProps) {
    return (
        <View>
              <Text style={styles.info}>
                Type: Alert
              </Text>
              <Text style={styles.info}>
                {`Title: ${props.title}`} 
              </Text>
              <Text style={styles.info}>
                {`Body: ${props.body}`} 
              </Text>
              {getBaseComponent(props)}
        </View>
    );
}

function getBackgroundComponent(props: DeliveredNotificationProps) {
    return (
        <View>
              <Text style={styles.info}>
                Type: Background
              </Text>
              {getBaseComponent(props)}
        </View>
    );
}

function NotificationDetailScreen() {

    const navigation = useNavigation<notificationScreenProp>();
    const route = useRoute<RouteProp<RootStackParamList, 'Notification'>>();

    let notificationProps: DeliveredNotificationProps = route.params.props
    console.log("Navigated to notification screen with props: " + JSON.stringify(notificationProps))

    return (
        <SafeAreaView>
            <View>
            <Text style={styles.title}>
                    Notification Detail Page
            </Text>
            {notificationProps.isBackgroundNotification ? getBackgroundComponent(notificationProps) : getAlertComponent(notificationProps)}
            </View>
        </SafeAreaView>
      );
}

export default NotificationDetailScreen