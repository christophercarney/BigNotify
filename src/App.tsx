import React from 'react'
import 'react-native-gesture-handler'
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './Home';
import LoginScreen from './Login';
import NotificationDetailScreen from './NotificationDetailPage';
import { RootStackParamList}  from './RootStackParams';
import ProfileScreen from './Profile';


const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Notification" component={NotificationDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}