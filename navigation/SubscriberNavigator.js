import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

import SubscriberScreen from '../screens/subscribers/Appl';

function SubscriberNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SubscriberList"
        component={SubscriberScreen}
        options={{headerShown: true}}
      />
    </Stack.Navigator>
  );
}

export default SubscriberNavigator;
