import React, {useEffect, useState} from 'react';

const logout = () => {
  AsyncStorage.removeItem('token')
    .then(() => {
      this.props.navigation.navigate('Login');
    })
    .catch(err => console.log(err));
};
export default logout;
