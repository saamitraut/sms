import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Stack = createNativeStackNavigator();
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import BottomTabNavigator from './BottomTabNavigation';
import GLOBALS from '../Globals'; // import {colors, fonts} from '../styles';

import {getOneTimeLocation} from '../helpers/locationHelper';
const image = {
  uri: '',
};

class AppNavigator extends Component {
  async loadProfile() {
    const token = await AsyncStorage.getItem('token');

    if (token != null) {
      loggedinDetails = JSON.parse(token);
      console.log(loggedinDetails);
      getOneTimeLocation(loggedinDetails.engineerId, loggedinDetails.userid);
    }
  }
  componentDidMount() {
    this.loadProfile();
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.employeeListContainer}>
          {/*  */}
          {/* <ImageBackground source={image} resizeMode="cover" style={styles.image}> */}
          <Text style={styles.listItem}>{GLOBALS.COMPANY_NAME}</Text>
          <Text style={styles.listItem2}>Field Force Application</Text>
          {/* </ImageBackground> */}
        </View>
        <NavigationContainer>
          {/*  */}
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="BottomTabNavigator"
              component={BottomTabNavigator}
              options={{headerShown: false}}
            />
            {/* <Stack.Screen
        name="Subscribers"
        component={SubscriberScreen}
        options={{headerShown: true}}
      /> */}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    );
  }
}
export default AppNavigator;
//

const styles = StyleSheet.create({
  listItem: {
    fontSize: 21,
    fontFamily: 'OleoScriptSwashCaps-Regular',
    textAlign: 'center',
  },
  listItem2: {
    fontSize: 15,
    fontFamily: 'OleoScriptSwashCaps-Regular',
    textAlign: 'center',
  },
  employeeListContainer: {
    margin: 10,
    elevation: 4,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 6,
    borderTopWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    backgroundColor: '#FFFFF7',
  },
});
