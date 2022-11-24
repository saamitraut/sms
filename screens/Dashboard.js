import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground, TextInput
} from 'react-native';
import Dashboard from 'react-native-dashboard';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import Globals from '../Globals';

class Home2 extends Component {
  // 
  constructor(props) {
    super(props);
    const { loggedinDetails } = props.route.params;
    this.state = {
      count: 0, messages: [],
      loggedinDetails: loggedinDetails,
      loggedinForTheday: false,
      engineerId: loggedinDetails.engineerId,
    };
  }

  navigate = this.props.navigation.navigate;

  data = [
    {
      name: 'Pending Calls',
      background: 'rgba(255, 255, 255, 0.9)',
      icon: () => (
        <Icon1
          name={'phone-call'}
          size={50}
          color={'#6699cc'}
          // style={{flex: 1, marginTop: 20, marginHorizontal: 5}}
          onPress={() => {
            this.navigate('Calls', { status: 1 });
          }}
        />
      ),

      nameColor: '#6699cc',
    },
    {
      name: 'Closed Calls',
      background: 'rgba(255, 255, 255, 0.9)',
      icon: () => (
        <Icon2
          name={'phone-callback'}
          size={50}
          color={'#6699cc'}
          // style={{flex: 1, marginTop: 20, marginHorizontal: 5}}
          onPress={() => {
            this.navigate('Calls', { status: 0 });
          }}
        />
      ),
      nameColor: '#6699cc',
    },
  ];

  loggedinForThedayFunc = () => {
    var data = new FormData();
    data.append('EngineerId', this.state.engineerId);
    const Url = `${Globals.BASE_URL}api/getLoginDetails.php`;

    fetch(Url, {
      method: 'POST',
      body: data,
    })
      .then(res => res.json())
      .then(res => {
        if (res.status) {
          this.setState({ loggedinForTheday: res.data });
        }
      })
      .catch(error => {
        console.log(error);
        this.showError();
      });
  };
  getData = () => {
    const { engineerId } = this.props.route.params.loggedinDetails;
    // alert('hello');

    var data = new FormData();
    data.append('EngineerId', engineerId);
    data.append('status', 1);
    const InsertAPIURL = `${Globals.BASE_URL}api/getCallDetails.php`;
    // console.log(InsertAPIURL);
    // console.log(data);
    fetch(InsertAPIURL, {
      method: 'POST',
      body: data,
    })
      .then(res => res.json())
      .then(res => {
        // console.log(res);
        this.data[0].name = 'Pending Calls: ' + Object.entries(res.data).length;
        this.setState({
          loading: false,
          errorMessage: '',
        });
      })
      .catch(
        error =>
          this.setState({
            loading: false,
            errorMessage: 'Network Error. Please try again.',
          }),
        // console.log(error),
      );
  };

  getData2 = () => {
    const { engineerId } = this.props.route.params.loggedinDetails;
    var data = new FormData();
    data.append('EngineerId', engineerId);
    data.append('status', 0);
    data.append('updatedon', new Date().toISOString().slice(0, 10));
    // console.log(data);
    const InsertAPIURL = `${Globals.BASE_URL}api/getCallDetails.php`;

    // console.log(this.data[0].name);
    fetch(InsertAPIURL, {
      method: 'POST',
      body: data,
    })
      .then(res => res.json())
      .then(res => {
        // console.log(res);

        this.data[1].name = 'Closed Calls: ' + Object.entries(res.data).length;
        this.setState({
          loading: false,
          errorMessage: '',
        });
      })
      .catch(
        error =>
          this.setState({
            loading: false,
            errorMessage: 'Network Error. Please try again.',
          }),
        // console.log(error),
      );
  };

  componentDidMount() {
    const { loggedinDetails } = this.props.route.params;
    const { navigate } = this.props.navigation;
    if (loggedinDetails == null) {
      navigate('Login');
    }
    // console.log(loggedinDetails);
    this.loggedinForThedayFunc();
    this.getData();
    // this.getData2();
  }

  render() {
    const { navigate } = this.props.navigation;
    const { loggedinDetails } = this.props.route.params;
    const { engineerId, email, fullName, userid } = loggedinDetails;
    //
    return (
      <View style={styles.container}>
        <ImageBackground
          imageStyle={{ opacity: 0.5 }}
          source={{
            uri: 'https://www.kindpng.com/picc/m/264-2640361_inventory-management-system-png-transparent-png.png',
          }}
          resizeMode="cover"
          style={styles.image}>
          <View>
            <Text style={styles.buttonText}>नमस्ते {fullName}</Text>
            {!this.state.loggedinForTheday ? (
              <Text style={styles.buttonText}>
                {/* तुम्ही आज लॉग इन केलेले नाही */}
                आपने आज लॉग इन नहीं किया है
              </Text>
            ) : (
              <Text style={styles.buttonText}>
                लॉगिन करण्याची वेळ {this.state.loggedinForTheday.loginTime}
              </Text>
            )}
          </View>
          {/* <TouchableOpacity
            onPress={() => this.loggedinForThedayFunc()}
            style={styles.button}>
            <Icon style={styles.buttonText} name="refresh" />
          </TouchableOpacity> */}

          {this.state.messages.map((message, index) => <Text key={index} style={styles.chatcontainer}>{message}</Text>)}
          <View>
            <TextInput
              defaultValue={''}
              multiline
              numberOfLines={3}
              style={styles.textBox}
              onChangeText={text => {
                this.setState({ warning: text }, () => { }  // console.log(this.state.warning),
                );
              }}
              value={this.state.warning}
              placeholder="यहां वह चेतावनी लिखें जिसे आप भेजना चाहते हैं"
            />

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                var formdata = new FormData();
                formdata.append("msg", "Warning");
                formdata.append("body", this.state.warning);

                var requestOptions = {
                  method: 'POST',
                  body: formdata,
                  redirect: 'follow'
                };

                fetch("https://seatvnetwork.com/notification/api/sendNotification/seatv", requestOptions)
                  .then(response => response.json())
                  .then(result => {
                    console.log('result');
                    let messagescopy = this.state.messages;
                    messagescopy.push(this.state.warning);

                    this.setState({ messages: messagescopy }, () => {
                      this.setState({ warning: '' });
                    })
                  })
                  .catch(error => console.log('error', error));
              }}>
              <Text style={styles.buttonText}>SendMessage</Text>
            </TouchableOpacity>
          </View>
          <Dashboard
            data={this.data}
            background={true}
            // card={card}
            column={2}
            rippleColor={'#3498db'}
          />
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  button: {
    borderRadius: 5,
    margin: 10,
    alignSelf: 'flex-end',
    backgroundColor: 'white',
  },
  buttonText: {
    color: '#6699cc',
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 23,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 19,
    fontFamily: 'serif',
    fontStyle: 'italic',
    color: '#34282C',
    textDecorationLine: 'underline',
    marginTop: 5,
  },
  textBox: { fontSize: 19, fontFamily: 'serif', fontWeight: 'bold' },

  chatcontainer: {
    backgroundColor: '#f1f1f1',
    borderWidth: 0.1,
    borderRadius: 5,
    padding: 10,
    margin: 5
  }
});

export default Home2;
