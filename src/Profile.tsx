import React from 'react'
import { SafeAreaView, View, Text } from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './RootStackParams';
import { styles } from './styles'
import { viewUser } from './operations';


type profileScreenProp = StackNavigationProp<RootStackParamList, 'Profile'>;

function ProfileScreen() {

    const navigation = useNavigation<profileScreenProp>();
    const route = useRoute<RouteProp<RootStackParamList, 'Profile'>>();

    let username: string = route.params.name
    console.log("Navigated to profile screen " + JSON.stringify(navigation) + " with name: " + username)

    const [userData, setUserData] = React.useState('')

    React.useEffect(() => {
        viewUser(username).then((result) => {
            setUserData(JSON.stringify(result))
        })
    }, [])

    return (
        <SafeAreaView>
            <View>
            <Text style={styles.title}>
                    Profile Page
            </Text>
            <Text>
                {userData}
            </Text>
            </View>
        </SafeAreaView>
      );
}

export default ProfileScreen