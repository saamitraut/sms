import React, { Component } from 'react';
import Geolocation from 'react-native-geolocation-service'; //V IMP
import { PermissionsAndroid } from 'react-native';
import { showMessage, hideMessage } from 'react-native-flash-message';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Globals from '../Globals';

async function requestLocationPermission(PermissionDenied) {
  if (Platform.OS === 'ios') {
    // getOneTimeLocation();
    // subscribeLocationLocation();
  } else {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Access Required',
          message: 'This App needs to Access your location',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //To Check, If Permission is granted
        //   this.getOneTimeLocation();
        //   this.subscribeLocationLocation();
      } else {
        PermissionDenied;
      }
      // PermissionsAndroid.requestMultiple([
      //   PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      //   PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      //   PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      // ]).then(result => {
      //   // console.log(result);
      // });
    } catch (err) {
      console.warn(err);
    }
  }
}
//

function getOneTimeLocation(engineerId, userid, remark = '') {
  return new Promise(resolve => {
    Geolocation.getCurrentPosition(
      position => {
        DeviceInfo.getUniqueId().then(deviceid => {
          var data = new FormData();

          data.append(
            'currentLongitude',
            JSON.stringify(position.coords.longitude),
          );

          data.append(
            'currentLatitude',
            JSON.stringify(position.coords.latitude),
          );
          data.append('deviceid', deviceid);
          data.append('engineerId', engineerId);
          data.append('userid', userid);
          data.append('remark', remark);
          // console.log(data);

          var xhr = new XMLHttpRequest();

          xhr.withCredentials = true;

          xhr.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
              // alert(this.responseText);
              const response = JSON.parse(this.responseText);

              showMessage({
                message: response.Message,
                type: 'info',
              });
            }
          });
          xhr.open('POST', `${Globals.BASE_URL}api/savelocation.php`);
          xhr.send(data);

          function addZero(i) {
            if (i < 10) {
              i = '0' + i;
            }
            return i;
          }
          let d = new Date();
          let date = d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();

          let h = addZero(d.getHours());
          let m = addZero(d.getMinutes());
          let time = h + ':' + m;
          //

          if (remark == 'login') {
            Promise.all([
              AsyncStorage.setItem('today', date),
              AsyncStorage.setItem('time', time),
            ]).then(value => {
              resolve(time);
            });

            // Promise.all([
            //   AsyncStorage.removeItem('today'),
            //   AsyncStorage.removeItem('date'),
            //   AsyncStorage.removeItem('login'),
            // ]).then(() => alert('today removed successfully'));
          }
          if (remark == 'logout') {
            AsyncStorage.removeItem('today');
            AsyncStorage.removeItem('time');
          }
        })


      },

      error => {
        // this.setState({locationStatus: error.message});
      },
      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  });
}
//

function getDiff(date = new Date()) {
  const today = new Date(date);

  const endDate = new Date();
  const days = parseInt((endDate - today) / (1000 * 60 * 60 * 24));
  const hours = parseInt((Math.abs(endDate - today) / (1000 * 60 * 60)) % 24);
  const minutes = parseInt(
    (Math.abs(endDate.getTime() - today.getTime()) / (1000 * 60)) % 60,
  );
  const seconds = parseInt(
    (Math.abs(endDate.getTime() - today.getTime()) / 1000) % 60,
  );
  return (
    days +
    ' days ' +
    hours +
    ' hours ' +
    minutes +
    ' minutes ' +
    seconds +
    ' seconds '
  );
  // return date + today.getHours();
}
//

export { requestLocationPermission, getOneTimeLocation, getDiff };
