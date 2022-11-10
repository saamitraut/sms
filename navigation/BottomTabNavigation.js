import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Leaves from '../screens/leaves/Appl';
import Calls from '../screens/home/Appl';
import HomeScreen from '../screens/Home';

import DashBoard from '../screens/Dashboard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

export default function App({navigation, route}) {
  const {loggedinDetails} = route.params;
  const Logout = () => {
    AsyncStorage.removeItem('token')
      .then(() => {
        navigation.navigate('Login');
      })
      .catch(err => console.log(err));
    return <></>;
  };

  //

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          }
          if (route.name === 'Calls') {
            iconName = focused ? 'call' : 'call-outline';
          }
          if (route.name === 'Leaves') {
            iconName = focused ? 'people' : 'people-outline';
          }
          if (route.name === 'Logout') {
            return <Icon2 name="logout" size={size} color={color} />;
          } else {
            return <Icon name={iconName} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#6699CC',
        tabBarInActiveTintColor: 'gray',
        headerShown: false,
      })}>
      <Tab.Screen
        name="Home"
        component={DashBoard}
        initialParams={{loggedinDetails: loggedinDetails}}
      />
      <Tab.Screen
        name="Calls"
        component={Calls}
        initialParams={{loggedinDetails: loggedinDetails}}
      />
      <Tab.Screen
        name="Leaves"
        component={Leaves}
        initialParams={{loggedinDetails: loggedinDetails}}
      />
      <Tab.Screen
        name="Logout"
        component={Logout}
        // listeners={{
        //   tabPress: e => {
        //     e.preventDefault(); // Use this to navigate somewhere else
        //     // const keys = AsyncStorage.getAllKeys()
        //     //   .then(keys => AsyncStorage.multiGet(keys))
        //     //   .then(result => console.log(result));
        //     AsyncStorage.removeItem('token')
        //       .then(() => {
        //         navigation.navigate('Login');
        //       })
        //       .catch(err => console.log(err));
        //   },
        // }}
      />
      {/*  */}
    </Tab.Navigator>
  );
}
