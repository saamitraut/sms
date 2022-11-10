import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Home extends Component {
  constructor(props) {
    super(props);
    //
    // console.log('props on line 25 scrreens/Home.js');
    const {loggedinDetails} = props.route.params;
    // console.log(loggedinDetails);
    this.state = {
      loggedinDetails: loggedinDetails,
    };
  }
  //

  componentDidMount() {
    const {loggedinDetails} = this.props.route.params;
    const {navigate} = this.props.navigation;
    if (loggedinDetails == null) {
      navigate('Login');
    }
    // AsyncStorage.getItem('token').then(res => {})
  }

  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
        <View>
          {/* <Text>{JSON.stringify(this.state.loggedinDetails)}</Text> */}
          <Text style={styles.input}>Open Calls {5}</Text>
          <Text style={styles.input}>Closed Calls {50}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },

  input: {
    width: 300,
    backgroundColor: '#B6BFC4',
    borderRadius: 25,
    padding: 16,
    fontSize: 16,
    marginVertical: 10,
  },
});

export default Home;
