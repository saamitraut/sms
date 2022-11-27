import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  // ScrollView,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import DeviceInfo from 'react-native-device-info';

import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Globals from '../Globals';

const formSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required().min(6),
});

const LoginScreen = props => {
  const { navigation } = props;
  const isFocused = useIsFocused();
  const [email, setemail] = useState(() => 'pkadam9292@gmail.com');

  const loadProfile = async () => {
    const token = await AsyncStorage.getItem('token');

    if (token != null) {
      props.navigation.navigate('BottomTabNavigator', {
        loggedinDetails: JSON.parse(token),
      });
    }
  };

  useEffect(() => {
    // const keys = AsyncStorage.getAllKeys()
    //   .then(keys => AsyncStorage.multiGet(keys))
    //   .then(result => {
    //     console.log(result[0][1]);
    //     setemail(result[0][1]);
    //     console.log(email);
    //   });
    loadProfile();

    if (isFocused) {
      // alert('hello');
    }
  }, [props, isFocused]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}>
      <Formik
        //
        initialValues={{
          email: email,
          password: '123456',
        }}
        validationSchema={formSchema}
        onSubmit={values => {
          let loginAPIURL = `${Globals.BASE_URL}/check.php`;
          DeviceInfo.getUniqueId().then(deviceId => {
            // 
            var data = new FormData();
            data.append('password', values.password);
            data.append('email', values.email);
            data.append('deviceId', deviceId);

            fetch(loginAPIURL, {
              method: 'POST',
              body: data,
            })
              .then(response => response.json())
              .then(result => {
                // console.log(result);
                let d = new Date();
                let date =
                  d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();

                if (result.success) {
                  try {
                    Promise.all([
                      AsyncStorage.setItem(
                        'token',
                        JSON.stringify(result.loggedinDetails),
                      ),
                      AsyncStorage.setItem('email', result.loggedinDetails.email), // store loggedinDetails as well as date
                    ]).then(
                      props.navigation.navigate('BottomTabNavigator', {
                        loggedinDetails: result.loggedinDetails,
                      }),
                    );
                  } catch (err) {
                    console.log(err);
                  }
                } else {
                  Alert.alert(result.message);
                }
              })
              .catch(error => {
                console.error('Error:', error);
              });
          });


        }}>
        {props => (
          <View style={styles.container}>
            <View style={styles.logo}>
              <Image
                style={styles.image}
                source={{ uri: 'https://medianucleus.com/images/logo1.png' }}
              // source={require(`../assets/images/logo.png`)}
              // source={{ uri: 'https://seatvnetwork.com/images/seatvlogo.png' }}
              />
            </View>
            <View>
              <TextInput
                style={styles.input}
                placeholder="Email.."
                placeholderTextColor="#fff"
                keyboardType="email-address"
                onChangeText={props.handleChange('email')}
                value={props.values.email}
                onBlur={props.handleBlur('email')}
                autoCapitalize="none"
              />
              <Text style={styles.error}>
                {props.touched.email && props.errors.email}
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#fff"
                secureTextEntry={true}
                onChangeText={props.handleChange('password')}
                value={props.values.password}
                onBlur={props.handleBlur('password')}
              />
              <Text style={styles.error}>
                {props.touched.password && props.errors.password}
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={props.handleSubmit}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Don't have account?</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.registerButton}>Register</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  image: {
    // borderRadius: 25,
    // backgroundColor: 'grey',
    width: 120,
    height: 100,
  },
  input: {
    width: 300,
    backgroundColor: '#B6BFC4',
    borderRadius: 25,
    padding: 16,
    fontSize: 16,
    marginVertical: 10,
  },
  button: {
    width: 300,
    backgroundColor: '#738289',
    borderRadius: 25,
    marginVertical: 10,
    paddingVertical: 13,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center',
  },
  registerContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingVertical: 16,
    flexDirection: 'row',
  },
  registerText: {
    color: '#738289',
    fontSize: 16,
  },
  registerButton: {
    color: '#738289',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
  },
});
//

export default LoginScreen;
