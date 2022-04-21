import React from 'react'
import { Button, SafeAreaView, FlatList, Text, View, NativeModules, TouchableOpacity, TextInput } from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './RootStackParams';
import { Separator, styles } from './styles';
import { sendBackgroundUpdate, sendNotification } from './operations'

type homeScreenProp = StackNavigationProp<RootStackParamList, 'Home'>;

export type DeliveredNotificationProps = {
    isBackgroundNotification: boolean,
    operatingSystem: string,
    backend: string,
    lineage: string[],
    uuid: string,
    data?: Object,
    title?: string,
    body?: string
}

function HomeScreen() {
    const navigation = useNavigation<homeScreenProp>();
    const route = useRoute<RouteProp<RootStackParamList, 'Home'>>();

    React.useEffect(() => {
        onFetchNotificationDataPressed()
    }, []);

    const [notifs, setNotifs] = React.useState([]);
    const [title, setTitle] = React.useState("This is a test notification")
    const [body, setBody] = React.useState("Triggered from inside the app")

    console.log(`Got route: ${JSON.stringify(route)} & navigation: ${JSON.stringify(navigation)}`)

    let username: string = route.params.name

    function onFetchNotificationDataPressed() {
        NativeModules.NotificationWrapper.getNotificationData().then((result: string) => {
            const flatListData = JSON.parse(result).map((item: any, index: number) => {
                return {
                    isBackgroundNotification: item["background"],
                    operatingSystem: item["operatingSystem"],
                    backend: item["backend"],
                    uuid: item["uuid"] ?? index,
                    data: item["data"],
                    title: item["title"],
                    body: item["body"],
                    lineage: item["lineage"]
                 }
            });
            console.log("flatListData: " + JSON.stringify(flatListData))
            setNotifs(flatListData)
        }).catch((err: any) => console.log(err))
    }

    function _onListItemPress(item: DeliveredNotificationProps) {
        console.log("List item pressed: " + JSON.stringify(item))
        navigation.navigate('Notification', { props: item })
    }
    function _renderItem(item: any): React.ReactElement { 
        return (
            <TouchableOpacity onPress={() => _onListItemPress(item['item'])}>
                <Text style={styles.listitem}>{item['item'].title ?? `Background ${item['item'].uuid}`} </Text>
            </TouchableOpacity>
        );
    }

    async function onTriggerAlertPressed() {
        let data = await sendNotification(username, title, body)
        console.log(JSON.stringify(data))
    }

    async function onTriggerBackgroundPressed() {
        let data = await sendBackgroundUpdate(username, {"Key_1": "Data_1"})
        console.log(JSON.stringify(data))
    }

    function onToProfilePressed() {
        navigation.navigate('Profile', { name: username })
    }

    return (
      <SafeAreaView>
          <View>
              <Text style={styles.title}>
                  BigNotify Home
              </Text>
              <Separator />
              <TextInput 
                    style={styles.input}
                    onChangeText={setTitle}
                    value={title} />
               <TextInput 
                    style={styles.input}
                    onChangeText={setBody}
                    value={body} />
              <Button title="Trigger Alert Notification" onPress={onTriggerAlertPressed}/>
              <Separator />
              <Button title="Trigger Background Notification" onPress={onTriggerBackgroundPressed}/>
              <Separator />
              <Button title="To Profile" onPress={onToProfilePressed} disabled={username === ''}/>
              <Separator />
              <Button title="Fetch Notification Data" onPress={onFetchNotificationDataPressed}/>
              <Separator />
              <Text style={styles.info}>
                  Currently logged in as: {username}
              </Text>
              <FlatList data={notifs} renderItem={_renderItem} />
          </View>
      </SafeAreaView>
    );
  }
  
  export default HomeScreen;