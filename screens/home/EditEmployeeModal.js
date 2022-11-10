import React, { Component } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Globals from '../../Globals';
import { Picker } from '@react-native-picker/picker';
import ImagePicker from 'react-native-image-crop-picker';
import Icon1 from 'react-native-vector-icons/FontAwesome5';
import Geolocation from 'react-native-geolocation-service'; //V IMP

class EditEmployeeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CallLogId: '',
      CalltypeId: 0,
      CustomerId: '',
      Description: '',
      Engineer: '',
      SubCallType: '',
      SubscriberName: '',
      complaintid: '',
      status: 0,
      originalstatus: 0,
      subscriberid: '',
      loading: false,
      errorMessage: '',
      address: '',
      MobileNo: 0,
      showclear: false,
      loggedinDetails: {},
      uri: 'https://cdn1.vectorstock.com/i/1000x1000/56/05/inventory-checkboard-icon-flat-style-vector-29615605.jpg',
      uri2: '',
      imagedetails: '',
    };
  }

  componentDidMount() {
    // this.requestCameraPermission();
    // state value is updated by selected employee data
    // console.log('this.props screens/home/editemployeemodel');
    // console.log(this.props);
    const {
      CallLogId,
      CalltypeId,
      CustomerId,
      Description,
      Engineer,
      SubCallType,
      SubscriberName,
      complaintid,
      status,
      subscriberid,
      address,
      MobileNo,
    } = this.props.selectedEmployee;

    this.setState({
      CallLogId: CallLogId,
      CalltypeId: CalltypeId,
      CustomerId: CustomerId,
      Description: Description,
      Engineer: Engineer,
      SubCallType: SubCallType,
      SubscriberName: SubscriberName,
      complaintid: complaintid,
      status: status,
      originalstatus: status,
      subscriberid: subscriberid,
      loading: false,
      errorMessage: '',
      address: address,
      Replyid: 0,
      Reply: '',
      CreatedBy: this.props.loggedinDetails.userid,
      loggedinDetails: this.props.loggedinDetails,
      MobileNo: MobileNo,
      OTP1: 'xxx',
      OTP: '',
    });
  }

  handleChange = (value, state) => {
    this.setState({ [state]: value });
  };

  makeid(length) {
    var characters = '0123456789';
    //
    var result = '';
    var charactersLength = characters.length;

    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  sendConfirmationOTP = () => {
    this.setState({ errorMessage: '', loading: true });
    var data = new FormData();
    const OTP1 = this.makeid(5);
    this.setState({ OTP1: OTP1 });

    data.append('MobileNo', this.state.MobileNo);
    data.append('CallLogId', OTP1);
    data.append('SubscriberName', this.state.SubscriberName);
    console.log(data);

    const InsertAPIURL = `${Globals.BASE_URL}api/call_verification.php`;

    fetch(InsertAPIURL, {
      method: 'POST',
      body: data,
    })
      .then(res => res.json())
      .then(res => {
        // console.log(res);
        if ((res.Status = 'success')) {
          alert(res.Message);
        }
        this.setState({
          loading: false,
          errorMessage: '',
        });
      })
      .catch(() =>
        this.setState({
          loading: false,
          errorMessage: 'Network Error. Please try again.',
        }),
      );
  };

  updateEmployee = () => {
    // console.log('state in updateEmployee');// console.log(this.state);// return;// alert(JSON.stringify(this.state));

    const { complaintid, Reply, status, CreatedBy, Replyid, OTP, OTP1 } =
      this.state;
    this.setState({ errorMessage: '', loading: true });

    if (true) {
      //new addition storing location when adding call reply
      Geolocation.getCurrentPosition(position => {
        var data = new FormData();

        data.append(
          'currentLongitude',
          JSON.stringify(position.coords.longitude),
        );

        data.append(
          'currentLatitude',
          JSON.stringify(position.coords.latitude),
        );

        data.append('complaintid', complaintid);
        data.append('Reply', Reply);
        data.append('status', status);
        data.append('CreatedBy', CreatedBy);
        data.append('Replyid', Replyid);
        data.append('updatedby', this.state.loggedinDetails.userid);
        data.append('uri2', this.state.uri2);
        data.append('version', '0.0.1');
        //new things to send sms on closing the call
        data.append('MobileNo', this.state.MobileNo);
        data.append('CallLogId', this.state.CallLogId);
        data.append('SubscriberName', this.state.SubscriberName);
        console.log(data);
        // return;
        const updateAPIURL = `${Globals.BASE_URL}api/updateCallDetails.php`;

        // console.log(data);
        fetch(updateAPIURL, {
          method: 'POST',
          body: data,
        })
          .then(response => {
            //
            if (response.ok) {
              // console.log(response);
              return response.json();
            }
            throw new Error('Something went wrong');
          })
          .then(res => {
            // console.log(res);
            // return;
            if (res.status) {
              this.props.closeModal();
              this.props.updateEmployee(res.data);
              // alert(res.msg);
            } else {
              alert(res.msg);
            }
          })
          .catch(error => {
            console.log(error);
            this.setState({
              loading: false,
              errorMessage: 'Network Error. Please try again.',
            });
          });
      });
    } else {
      this.setState({ errorMessage: 'Fields are empty.', loading: false });
    }
  };
  //

  render() {
    const { isOpen, closeModal } = this.props;
    const {
      CallLogId,
      CalltypeId,
      CustomerId,
      Description,
      Engineer,
      SubCallType,
      SubscriberName,
      complaintid,
      status,
      originalstatus,
      subscriberid,
      loading,
      errorMessage,
      address,
      Replyid,
      Reply,
      MobileNo,
      display,
      loggedinDetails,
      uri,
    } = this.state;
    // console.log(loggedinDetails);
    // console.log('loggedinDetails home/editemployeemodel line 212');

    return (
      <Modal
        propagateSwipe={true}
        visible={isOpen}
        onRequestClose={closeModal}
        animationType="slide">
        <ScrollView>
          <View style={{ padding: 20, flex: 1 }}>
            <View style={[styles.card, styles.elevation]}>
              <Text style={styles.title2}>
                Update Call{' '}
                <Text
                  onPress={() => {
                    this.setState({ showclear: !this.state.showclear });
                    // alert(this.state.showclear);
                  }}>
                  ( Details )
                </Text>
              </Text>

              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={{ flex: 1, padding: 10 }}>
                  <Text style={styles.title2}>CallLogId:</Text>
                  <TextInput
                    editable={false}
                    defaultValue={CallLogId}
                    style={styles.textBox}
                    placeholder="CallLogId"
                  />
                </View>

                <View style={{ flex: 1, padding: 10 }}>
                  <Text style={styles.title2}>CallType:</Text>
                  <TextInput
                    editable={false}
                    defaultValue={CalltypeId == 2 ? 'Complaint' : ''}
                    style={styles.textBox}
                    placeholder="CallType"
                  />
                </View>
              </View>
              <Text style={styles.title2}>Description:</Text>
              <TextInput
                multiline={true}
                numberOfLines={2}
                editable={false}
                defaultValue={Description}
                style={styles.textBox}
                placeholder="Description"
              />
              {this.state.showclear && (
                <View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{ flex: 1, padding: 10 }}>
                      <Text style={styles.title2}>SubCallType:</Text>
                      <TextInput
                        editable={false}
                        defaultValue={SubCallType}
                        style={styles.textBox}
                        placeholder="SubCallType"
                      />
                    </View>

                    <View style={{ flex: 1, padding: 10 }}>
                      <Text style={styles.title2}>complaintid:</Text>
                      <TextInput
                        editable={false}
                        defaultValue={complaintid}
                        style={styles.textBox}
                        placeholder="complaintid"
                      />
                    </View>
                  </View>

                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{ flex: 1, padding: 10 }}>
                      <Text style={styles.title2}>subscriberid:</Text>
                      <TextInput
                        editable={false}
                        defaultValue={subscriberid}
                        style={styles.textBox}
                        placeholder="subscriberid"
                      />
                    </View>

                    <View style={{ flex: 1, padding: 10 }}>
                      <Text style={styles.title2}>SubscriberName</Text>
                      <TextInput
                        editable={false}
                        defaultValue={SubscriberName}
                        style={styles.textBox}
                        placeholder="SubscriberName"
                      />
                    </View>
                  </View>

                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View style={{ flex: 1, padding: 10 }}>
                      <Text style={styles.title2}>CustomerId:</Text>
                      <TextInput
                        editable={false}
                        defaultValue={CustomerId}
                        style={styles.textBox}
                        placeholder="CustomerId"
                      />
                    </View>

                    <View style={{ flex: 1, padding: 10 }}>
                      <Text style={styles.title2}>Engineer:</Text>
                      <TextInput
                        editable={false}
                        defaultValue={Engineer}
                        style={styles.textBox}
                        placeholder="Engineer"
                      />
                    </View>
                  </View>

                  <Text style={styles.title2}>Address:</Text>
                  <TextInput
                    multiline={true}
                    numberOfLines={2}
                    editable={false}
                    defaultValue={address}
                    style={styles.textBox}
                    placeholder="address"
                  />
                </View>
              )}

              <View style={{ display: originalstatus == 1 ? 'flex' : 'none' }}>
                <Text style={styles.title2}>Reply:</Text>
                <TextInput
                  defaultValue={Reply}
                  style={styles.textBox}
                  onChangeText={text => this.handleChange(text, 'Reply')}
                  placeholder="Reply"
                />
                <Text style={styles.title2}>CONFIRMATION OTP:</Text>

                <TextInput
                  defaultValue={''}
                  style={styles.textBox}
                  onChangeText={text => this.handleChange(text, 'OTP')}
                  placeholder="OTP"
                />
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{ flex: 1, padding: 10 }}>
                    <Text style={styles.title2}>Final Status:</Text>
                    <Picker
                      selectedValue={Replyid}
                      onValueChange={text =>
                        this.handleChange(text, 'Replyid')
                      }>
                      <Picker.Item label="Select Final Status " value="" />
                      <Picker.Item label="Ok Accomplished" value="1" />
                      <Picker.Item label="Failed Not Accomplished" value="2" />
                      <Picker.Item label="Declined Inadmissible" value="3" />
                    </Picker>
                  </View>

                  <View style={{ flex: 1, padding: 10 }}>
                    <Text style={styles.title2}>Status</Text>
                    {status ? (
                      <TouchableOpacity
                        style={{
                          ...styles.button,
                          marginVertical: 0,
                          backgroundColor: '#034f84',
                        }}
                        //
                        onPress={() => this.setState({ status: 0 })}>
                        <Text style={styles.buttonText}>OPEN</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={{
                          ...styles.button,
                          marginVertical: 0,
                          backgroundColor: '#d64161',
                        }}
                        onPress={() => this.setState({ status: 1 })}>
                        <Text style={styles.buttonText}>CLOSED</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  onPress={this.sendConfirmationOTP}
                  style={styles.button}>
                  <Text style={styles.buttonText}>CONFIRMATION OTP</Text>
                </TouchableOpacity>
                <Image source={{ uri: uri }} style={{ width: 100, height: 100 }} />
                <Icon1
                  onPress={() => {
                    ImagePicker.openCamera({
                      width: 300,
                      height: 300,
                      cropping: true,
                    })
                      .then(image => {
                        // console.log(image);
                        this.setState(
                          { uri: image.path, uri2: image.modificationDate },
                          () => {
                            this.setState({
                              imagedetails: JSON.stringify(image),
                            });
                            const InsertAPIURL = `${Globals.BASE_URL}api/imageupload.php`;
                            var data = new FormData();
                            data.append('path', {
                              uri: image.path,
                              type: image.mime,
                              name: image.modificationDate + '.jpg',
                            });

                            fetch(InsertAPIURL, {
                              method: 'POST',
                              body: data,
                              headers: {
                                'Content-Type': 'multipart/form-data',
                              },
                            })
                              .then(res => res.json())
                              .then(res => console.log(res))
                              .catch(() => this.showError());
                          },
                        );
                      })
                      .catch(e => {
                        console.log(e);
                      });
                  }}
                  style={styles.buttonText2}
                  name="camera-retro"></Icon1>
              </View>
              {loading ? (
                <Text style={styles.message}>Please Wait...</Text>
              ) : errorMessage ? (
                <Text style={styles.message}>{errorMessage}</Text>
              ) : null}
              <View style={styles.buttonContainer}>
                {originalstatus == 1 ? (
                  <TouchableOpacity
                    onPress={this.updateEmployee}
                    // onPress={() => alert('hello')}
                    style={{ ...styles.button, marginVertical: 0 }}>
                    <Text style={styles.buttonText}>Update</Text>
                  </TouchableOpacity>
                ) : (
                  <Text></Text>
                )}

                <TouchableOpacity
                  onPress={closeModal}
                  style={{
                    ...styles.button,
                    marginVertical: 0,
                    marginLeft: 10,
                    backgroundColor: 'tomato',
                  }}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </Modal>
    );
  }
}

export default EditEmployeeModal;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 20,
  },
  textBox: {
    borderWidth: 1,
    borderRadius: 6,
    borderColor: 'rgba(0,0,0,0.3)',
    marginBottom: 15,
    fontSize: 18,
    padding: 10,
    borderWidth: 0,
    borderBottomWidth: 1,
    fontFamily: 'serif',
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    borderRadius: 5,
    marginVertical: 20,
    alignSelf: 'flex-start',
    backgroundColor: 'gray',
  },
  buttonText: {
    color: 'white',
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: 'serif',
  },
  buttonText2: {
    color: 'black',
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 36,
  },
  message: {
    color: 'tomato',
    fontSize: 16,
  },
  title2: {
    fontWeight: 'bold',
    fontSize: 20,
    fontFamily: 'serif',
    marginTop: 15,
    color: '#37859b',
  },
  title3: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 5,
    color: '#eca1a6',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 45,
    paddingHorizontal: 25,
    width: '100%',
    marginVertical: 10,
  },
  elevation: {
    elevation: 20,
    shadowColor: '#52006A',
  },
});
