import React from 'react';
import { View, Text, TextInput, Button, NativeEventEmitter, NativeModules, Platform, Alert, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './RootStackParams';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { styles, Separator } from './styles'
import { SafeAreaView } from 'react-native-safe-area-context';
import {deleteUser, deregisterUser, PushNotificationChannel, registerUser} from './operations'

function notifyMessage(msg: string) {
    if (Platform.OS === 'android') {
        ToastAndroid.show(msg, ToastAndroid.SHORT)
    } else {
        Alert.alert(msg);
    }
}

type loginScreenProp = StackNavigationProp<RootStackParamList, 'Login'>;


const saveTokenData = async (token: string) => {
    try {
        console.log("Saved token: " + token)
        await AsyncStorage.setItem('@token', token)
    } catch(e) {
        console.log(`Failed to save @token to async storage: ${e}`)
    }
}

const eventEmitter = new NativeEventEmitter(NativeModules.NotificationWrapper);
eventEmitter.addListener("onDeviceTokenRegistered", saveTokenData)


function LoginScreen() {

    const [username, setUsername] = React.useState('');
    const [endpointId, setEndpointId] = React.useState('');
    const [queryOsToken, setQueryOsToken] = React.useState('');

    React.useEffect(() => {
        // https://devtrium.com/posts/async-functions-useeffect
        readUserData();
    }, []);

    React.useEffect(() => {
        saveUserData();
    }, [endpointId]);

    eventEmitter.addListener("onDeviceTokenRegistered", (token: string) => {
        setQueryOsToken(token)
    })

    const navigation = useNavigation<loginScreenProp>();

    const saveUserData = async () => {
        try {
            await AsyncStorage.setItem('@username', username)
            await AsyncStorage.setItem('@token', queryOsToken)
            await AsyncStorage.setItem('@endpointId', endpointId)
        } catch(e) {
            console.log(`Failed to save data to async storage: ${e}`)
        }
    }

    const readUserData = async () => {
        try {
            console.log("Reading user data")
            const uname = await AsyncStorage.getItem('@username')
            if (uname !== null) {
                console.log("Got existing username data")
                setUsername(uname)
            }

            const tok = await AsyncStorage.getItem('@token')
            if (tok !== null) {
                console.log("Got existing token data")
                setQueryOsToken(tok)
            }

            const eid = await AsyncStorage.getItem('@endpointId')
            if (eid !== null) {
                console.log("Got existing endpointId data")
                setEndpointId(eid)
            }
        } catch(e) {
            console.log(`Failed to fetch datafrom async storage: ${e}`)
        }
    }

    function onToFeatureScreenPress() {
        saveUserData()
        navigation.navigate('Home', { name: username })
    }
    
    function onTriggerTokenHandler() {
        NativeModules.NotificationWrapper.getDeviceToken().then((result: string) => {
            console.log("onGetTokenButtonPress :" + result)
        })
    }

    function onRequestPermissionButtonPress() {
        NativeModules.NotificationWrapper.requestNotificationPermission().then((result: string) => {
            console.log("onRequestPermissionButtonPress: " + result)
        })
    }

    async function onRegisterUserPressed() {
        const data = await registerUser(username, queryOsToken)
        console.log("Register response: " + JSON.stringify(data))
        if (data["0"]["MessageBody"]["Message"] === "Accepted") {
            setEndpointId(data["endpointId"])
            notifyMessage("Successfully Registered User")
        }
    }

    async function onDeregisterUserPressed() {
        const data = await deregisterUser(username)
        console.log("Degister response: " + JSON.stringify(data))
        setUsername('')
        setEndpointId('')
    }

    async function onDeleteUserPressed() {
        const data = await deleteUser(username)
        console.log("Delete user response: " + JSON.stringify(data))
        setUsername('')
        setEndpointId('')
    }
  
    return (
        <SafeAreaView>
            <View>
                <Text style={styles.title}>
                    Big Notify Register Screen
                </Text>
                <Separator />
                <TextInput 
                    style={styles.input}
                    onChangeText={setUsername}
                    value={username}
                />
                <Button
                    title="Register"
                    onPress={onRegisterUserPressed}
                    disabled={username == '' || queryOsToken == ''}
                />
                <Button
                    title="Deregister"
                    onPress={onDeregisterUserPressed}
                    disabled={username == '' || endpointId == ''}
                />
                <Button
                    title="Delete User"
                    onPress={onDeleteUserPressed}
                    disabled={username == ''}
                />
                <Button
                    title="To Feature Screen"
                    onPress={onToFeatureScreenPress}
                />
                <Button
                    title="Trigger Token Handler"
                    onPress={onTriggerTokenHandler}
                />
                <Button
                    title="Request Permission"
                    onPress={onRequestPermissionButtonPress}
                />
                <Text style={styles.info}>
                  Push token: {queryOsToken}
                </Text>
                <Text style={styles.info}>
                  Endpoint ID: {endpointId}
                </Text>
            </View>
        </SafeAreaView>
    );
  }
  
  export default LoginScreen;