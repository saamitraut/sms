import React, { Component } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import Globals from '../../Globals';
import EditEmployeeModal from './EditEmployeeModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service'; //V IMP
import DeviceInfo from 'react-native-device-info';
import Icon1 from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import FlashMessage from 'react-native-flash-message';
import {
  requestLocationPermission,
  getOneTimeLocation,
  getDiff,
} from '../../helpers/locationHelper';
import DatePicker from 'react-native-date-picker';

class App extends Component {
  constructor(props) {
    super(props);
    const { loggedinDetails, status } = props.route.params;

    const { email, engineerId, fullName, userid } = loggedinDetails;
    // console.log(typeof status == 'undefined' ? 1 : status);
    var date = new Date();

    this.state = {
      calls: [],
      isAddEmployeeModalOpen: false,
      isEditEmployeeModalOpen: false,
      isDeleteEmployeeModalOpen: false,
      loading: false,
      errorMessage: '',
      selectedEmployee: {},
      // status: status == 'undefined' ? 1 : status,
      open: false,
      status: 1,
      SubscriberName: '',
      deviceId: '',
      loggedinDetails: loggedinDetails,
      email: email,
      engineerId: engineerId,
      userid: userid,
      fullName: fullName,
      updatedon: date,
      loggedinForTheday: { cnt: 0 },
      locationStatus: '',
      filter: false,
      CustomerId: null,
      loading: true, warning: null
    };
  }

  componentDidMount() {
    // alert('componentDidMount gets called');
    requestLocationPermission(this.PermissionDenied);
    getOneTimeLocation(this.state.engineerId, this.state.userid);

    this.getData(
      this.state.userid,
      this.state.status,
      this.state.CallLogId,
      this.state.SubscriberName,
      this.state.updatedon.toISOString().slice(0, 10),
    );
    this.getWatchId(this.state.engineerId, this.state.userid);

    // AsyncStorage.getAllKeys().then(keys => console.log(keys));
    var data = new FormData();
    data.append('EngineerId', this.state.engineerId);

    const Url = `${Globals.BASE_URL}api/getLoginDetails.php`;
    fetch(Url, {
      method: 'POST',
      body: data,
    })
      .then(res => res.json())
      .then(res => {
        // console.log(res);
        if (res.status) {
          this.setState({ loggedinForTheday: res.data });
        }
      })
      .catch(error => {
        console.log(error);
        this.showError();
      });
  }

  render() {
    // alert('render gets called');
    // console.log(this.state.engineerId);
    const {
      loading,
      errorMessage,
      employee,
      isAddEmployeeModalOpen,
      isEditEmployeeModalOpen,
      isDeleteEmployeeModalOpen,
      selectedEmployee,
    } = this.state;

    return (
      <ScrollView>
        <View style={styles.container}>
          <View
            style={[
              styles.container,
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
              },
            ]}>
            <TouchableOpacity
              onPress={() => {
                // console.log(this.state.status);
                let newstatus = +!this.state.status;
                this.setState({ status: newstatus }, () => {
                  // console.log(this.state.status);
                  this.getData(
                    this.state.userid,
                    this.state.status,
                    this.state.CallLogId,
                    this.state.SubscriberName,
                    this.state.updatedon.toISOString().slice(0, 10),
                  );
                });
              }}
              style={styles.button}>
              <Text style={styles.buttonText}>
                {!this.state.status ? 'Open Calls' : 'Closed Calls'}
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => {
                this.setState({status: 0}, () => {
                  // console.log(this.state);
                  this.getData(
                    this.state.engineerId,
                    this.state.status,
                    this.state.CallLogId,
                    this.state.SubscriberName,
                    this.state.updatedon.toISOString().slice(0, 10),
                  );
                });
              }}
              style={styles.button}>
              <Text style={styles.buttonText}>Closed Calls</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.setState({ open: true });
              }}>
              <Text style={styles.buttonText}>
                {this.state.updatedon.toISOString().slice(0, 10)}
              </Text>
            </TouchableOpacity>
            <DatePicker
              modal
              open={this.state.open}
              date={new Date()}
              mode={'date'}
              onConfirm={date => {
                // console.log(date);
                this.setState({ open: false, updatedon: date }, () => {
                  this.getData(
                    this.state.userid,
                    this.state.status,
                    this.state.CallLogId,
                    this.state.SubscriberName,
                    this.state.updatedon.toISOString().slice(0, 10),
                  );
                });
              }}
              onCancel={() => {
                this.setState({ open: false });
              }}
            />
            {/* <DatePicker2 update={this.update} /> */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                getOneTimeLocation(this.state.engineerId, this.state.userid);
              }}>
              <Text style={styles.buttonText}>Location</Text>
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.container,
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
              },
            ]}>
            {this.state.loggedinForTheday.cnt ? (
              <>
                {/* <Text style={styles.listItem2}>तुम्ही आज लॉग इन आहात</Text> */}
                <Text style={{ ...styles.listItem2, marginTop: 20 }}>
                  Login Time {this.state.loggedinForTheday.loginTime}
                </Text>
                {/* <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    getOneTimeLocation(
                      this.state.engineerId,
                      this.state.userid,
                      'logout',
                    );
                  }}>
                  <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity> */}
                <Icon2
                  style={{ marginVertical: 20, fontSize: 30 }}
                  onPress={() =>
                    getOneTimeLocation(
                      this.state.engineerId,
                      this.state.userid,
                      'logout',
                    )
                  }
                  name="logout"></Icon2>
              </>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  getOneTimeLocation(
                    this.state.engineerId,
                    this.state.userid,
                    'login',
                  );
                }}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
            )}
            <Icon1
              style={{ marginVertical: 20, fontSize: 30 }}
              onPress={() => this.setState({ filter: !this.state.filter })}
              name="filter"></Icon1>
          </View>
          <View>
            <Text style={{ color: 'red' }}>{this.state.locationStatus}</Text>
          </View>

          {this.state.filter ? (
            <>
              <View style={styles.row}>
                <TextInput
                  defaultValue={''}
                  style={styles.textBox}
                  onChangeText={text => {
                    this.setState({ CallLogId: text }, () =>
                      this.getData(
                        this.state.userid,
                        this.state.status,
                        this.state.CallLogId,
                        this.state.SubscriberName,
                        this.state.updatedon.toISOString().slice(0, 10),
                      ),
                    );
                  }}
                  placeholder="CallLogId"
                />
                <TextInput
                  defaultValue={''}
                  style={styles.textBox}
                  onChangeText={text => {
                    this.setState({ SubscriberName: text }, () =>
                      this.getData(
                        this.state.userid,
                        this.state.status,
                        this.state.CallLogId,
                        this.state.SubscriberName,
                        this.state.updatedon.toISOString().slice(0, 10),
                      ),
                    );
                  }}
                  placeholder="CustomerName"
                />
              </View>
              <View style={styles.row}>
                <TextInput
                  defaultValue={''}
                  style={styles.textBox}
                  onChangeText={text => {
                    this.setState({ CustomerId: text }, () =>
                      this.getData(
                        this.state.userid,
                        this.state.status,
                        this.state.CallLogId,
                        this.state.SubscriberName,
                        this.state.updatedon.toISOString().slice(0, 10),
                        this.state.CustomerId,
                      ),
                    );
                  }}
                  placeholder="CustomerId"
                />
                <TextInput
                  defaultValue={''}
                  style={styles.textBox}
                  onChangeText={text => {
                    this.setState({ MobileNo: text }, () =>
                      this.getData(
                        this.state.userid,
                        this.state.status,
                        this.state.CallLogId,
                        this.state.SubscriberName,
                        this.state.updatedon.toISOString().slice(0, 10),
                        null,
                        this.state.MobileNo,
                      ),
                    );
                  }}
                  placeholder="Mobile"
                />
              </View>
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
                  placeholder="Warning"
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
                      .then(result => console.log('result'))
                      .catch(error => console.log('error', error));
                  }}>
                  <Text style={styles.buttonText}>SendWarning</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <></>
          )}
          {!this.state.status ? (
            <Text style={styles.title2}>
              Closed calls on {this.state.updatedon.toISOString().slice(0, 10)}
            </Text>
          ) : null}
          {this.state.loading ? (
            <View style={[styles.container, styles.horizontal]}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : (
            <></>
          )}
          {this.state.calls != undefined ? (
            <View>
              {this.state.status ? (
                <Text style={styles.listItem2}>
                  {/* तुमचे {this.state.calls.length} कॉल प्रलंबित आहेत{' '} */}
                  Pending Calls {this.state.calls.length}
                </Text>
              ) : null}
              {/* <Text style={styles.title}>Call Lists:</Text> */}
              {this.state.calls.map((call, index) => (
                <View style={styles.employeeListContainer} key={call.CallLogId}>
                  <Text style={{ ...styles.listItem, color: 'tomato' }}>
                    {index + 1}.
                  </Text>
                  <Text style={styles.name}>{call.SubscriberName}</Text>
                  <Text style={styles.listItem}>{call.CustomerId}</Text>
                  <Text
                    style={styles.listItem}
                    onPress={() => this.makeCall(call.MobileNo)}>
                    {'MobileNo: ' + call.MobileNo}
                  </Text>

                  <Text style={styles.listItem}>
                    CallLogId: {call.CallLogId}
                  </Text>
                  <Text style={styles.listItem}>
                    Last Reply: {call.LastReply}
                  </Text>
                  <Text style={styles.listItem}>
                    Closed Reply: {call.ClosedReply}
                  </Text>
                  {/* <Text style={styles.listItem}>
                    CreatedOn: {call.createdon}
                  </Text> */}
                  <Text style={styles.listItem}>
                    Description: {call.Description}
                  </Text>
                  <Text style={styles.listItem}>Address: {call.address} </Text>
                  <Text style={styles.listItem}>
                    AssignedOn: {call.createdon2}
                  </Text>
                  <Text style={styles.listItem}>
                    TimeLapse: {getDiff(call.createdon2)}
                  </Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        this.toggleEditEmployeeModal();
                        this.setState({ selectedEmployee: call });
                      }}
                      style={{ ...styles.button }}>
                      {/* <Text style={styles.buttonText}>{this.state.status}</Text> */}
                      {this.state.status && call.reached ? (
                        // <Icon1 style={styles.buttonText} name="edit-3"></Icon1>
                        <Text style={styles.buttonText}>Update</Text>
                      ) : (
                        // <Icon1 style={styles.buttonText} name="eye"></Icon1>
                        <></>// <Text style={styles.buttonText}>View</Text>
                      )}
                    </TouchableOpacity>

                    {!call.accepted ? <TouchableOpacity
                      onPress={() => {
                        // console.log(this.state.status);
                        var formdata = new FormData();
                        formdata.append("complaintid", call.complaintid);
                        formdata.append("updatedby", this.state.userid);

                        var requestOptions = {
                          method: 'POST',
                          body: formdata,
                          redirect: 'follow'
                        };

                        fetch(`${Globals.BASE_URL}api/acceptcall.php`, requestOptions)
                          .then(response => response.json())
                          .then(result => {
                            // console.log(result);

                            if (result.status) {
                              this.setState(
                                {
                                  calls: this.state.calls.map(call =>
                                    call.complaintid == result.data.complaintid ? result.data : call,
                                  ),
                                },)
                            } else {
                              alert(result.data.msg)
                            }
                          })
                          .catch(error => console.log('error', error));
                      }}
                      style={styles.button}>
                      <Text style={styles.buttonText}>
                        Accept
                      </Text>
                    </TouchableOpacity> : <Text style={styles.listItem}>Accepted</Text>}

                    {call.accepted && !call.reached ? <TouchableOpacity style={styles.button} onPress={() => {
                      var formdata = new FormData();

                      formdata.append("complaintid", call.complaintid);
                      formdata.append("updatedby", this.state.userid);

                      var requestOptions = {
                        method: 'POST',
                        body: formdata,
                        redirect: 'follow'
                      };

                      fetch(`${Globals.BASE_URL}api/reachedlocation.php`, requestOptions)
                        .then(response => response.json())
                        .then(result => {
                          getOneTimeLocation(
                            this.state.engineerId,
                            this.state.userid,
                            'reached',
                          )
                          console.log(result)

                          if (result.status) {
                            this.setState(
                              {
                                calls: this.state.calls.map(call =>
                                  call.complaintid == result.data.complaintid ? result.data : call,
                                ),
                              },)
                          } else {
                            alert(result.data.msg)
                          }

                        })
                        .catch(error => console.log('error', error));

                    }}><Text style={styles.buttonText}>Reached</Text></TouchableOpacity> : null}
                  </View>
                </View>
              ))}

              {isEditEmployeeModalOpen ? (
                <EditEmployeeModal
                  isOpen={isEditEmployeeModalOpen}
                  closeModal={this.toggleEditEmployeeModal}
                  selectedEmployee={selectedEmployee}
                  updateEmployee={this.updateEmployee}
                  loggedinDetails={this.state.loggedinDetails}
                />
              ) : null}
            </View>
          ) : (
            <Text>No calls</Text>
          )}
          {/* </ImageBackground> */}
        </View>

        <FlashMessage position="top" />
      </ScrollView>
    );
  }
  updateStatus = status => this.setState({ status: status });

  PermissionDenied = () => this.setState({ locationStatus: 'Permission Denied' });

  updateStateCalls = data =>
    this.setState({
      calls: data,
      loading: false,
      errorMessage: '',
    });

  hideError = () => this.setState({ errorMessage: '', loading: true });

  check = myVariable => {
    if (typeof myVariable === 'undefined') return false;
    if (myVariable === 0) return false;
    return true;
  };

  showError = () =>
    this.setState({
      loading: false,
      errorMessage: 'Network Error. Please try again.',
    });
  //

  getWatchId = (engineerId, userid) => {
    Geolocation.watchPosition(position => {
      // alert('hellog');
      // const lastPosition = JSON.stringify(position);
      // this.setState({lastPosition});

      var data = new FormData();
      data.append('currentLatitude', JSON.stringify(position.coords.latitude));
      data.append(
        'currentLongitude',
        JSON.stringify(position.coords.longitude),
      );
      data.append('engineerId', engineerId);
      data.append('userid', userid);
      data.append('remark', 'background');
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.addEventListener('readystatechange', function () {
        if (this.readyState === 4) {
        }
      });

      xhr.open('POST', `${Globals.BASE_URL}api/savelocation.php`);
      xhr.send(data);
    });
  };

  // componentWillUnmount = () => {Geolocation.clearWatch(this.watchID);};

  getData = (
    accessid,
    status,
    CallLogId,
    SubscriberName,
    updatedon,
    CustomerId = null,
    MobileNo = null,
  ) => {
    this.hideError();

    var data = new FormData();
    data.append('accessid', accessid);
    data.append('status', status);
    data.append('CallLogId', CallLogId);
    data.append('SubscriberName', SubscriberName);
    data.append('updatedon', updatedon);
    if (CustomerId !== null) {
      data.append('CustomerId', CustomerId);
    }
    if (MobileNo !== null) {
      data.append('MobileNo', MobileNo);
    }

    const getCallsUrl = `${Globals.BASE_URL}api/getCallDetails2.php`;

    fetch(getCallsUrl, {
      method: 'POST',
      body: data,
    })
      .then(res => res.json())
      .then(res => {
        // console.log(data);
        // console.log(res.data);
        this.setState({ loading: false });
        this.updateStateCalls(res.data);
      })
      .catch(error => {
        console.log(error);
        this.showError();
      });
  };

  toggleAddEmployeeModal = () => {
    this.setState({ isAddEmployeeModalOpen: !this.state.isAddEmployeeModalOpen });
  };

  toggleEditEmployeeModal = () => {
    this.setState({
      isEditEmployeeModalOpen: !this.state.isEditEmployeeModalOpen,
    });
  };

  toggleDeleteEmployeeModal = () => {
    this.setState({
      isDeleteEmployeeModalOpen: !this.state.isDeleteEmployeeModalOpen,
    });
  };

  addEmployee = data => {
    // this.state.employee array is seprated into object by rest operator
    this.setState({ employee: [data, ...this.state.employee] });
  };

  updateEmployee = data => {
    // updating employee data with updated data if employee id is matched with updated data id
    this.setState(
      {
        calls: this.state.calls.map(call =>
          call.complaintid == data.complaintid ? data : call,
        ),
        status: 0,
      },
      () =>
        this.getData(
          this.state.engineerId,
          this.state.status,
          this.state.CallLogId,
          this.state.SubscriberName,
          this.state.updatedon.toISOString().slice(0, 10),
        ),
    );
  };

  deleteEmployee = employeeId => {
    // delete employee lsit with deleted data if employee id is matched with updated data id
    this.setState({
      employee: this.state.employee.filter(emp => emp.id !== employeeId),
    });
  };

  makeCall = phoneNumber => {
    if (Platform.OS === 'android') {
      phoneNumber = 'tel:${' + phoneNumber + '}';
    } else {
      phoneNumber = 'telprompt:${' + phoneNumber + '}';
    }
    Linking.openURL(phoneNumber);
  };

  update = date => {
    // console.log(date);
    this.setState(
      { updatedon: date, status: 0 },
      this.getData(
        this.state.engineerId,
        0,
        this.state.CallLogId,
        this.state.SubscriberName,
        date.toISOString().slice(0, 10),
      ),
    );
  };

  updateCalls = data =>
    this.setState({
      calls: data,
      loading: false,
      errorMessage: '',
    });

  updateError = () => {
    this.setState({
      loading: false,
      errorMessage: 'Network Error. Please try again.',
    });
  };
}

export default App;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
  },
  button: {
    borderRadius: 5,
    marginVertical: 20, marginHorizontal: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#6699cc',
  },
  button_inline: {
    borderRadius: 5,
    marginVertical: 20,
    backgroundColor: '#6699cc',
  },
  buttonText: {
    color: 'white',
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
  },
  title2: {
    // fontWeight: 'bold',
    fontSize: 21,
    marginBottom: 5,
    color: '#454545',
  },
  employeeListContainer: {
    marginBottom: 25,
    elevation: 4,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 6,
    borderTopWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
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
  listItem: {
    fontSize: 16,
    marginTop: 5, marginHorizontal: 5,
    fontFamily: 'serif',
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: {
    color: 'tomato',
    fontSize: 19,
  },
  listItem2: {
    fontSize: 23,
    fontFamily: 'OleoScriptSwashCaps-Regular',
    marginTop: 5,
    marginBottom: 5,
    textAlign: 'center',
    color: '#34282C',
  },
  listItem3: {
    fontSize: 19,
    fontFamily: 'OleoScriptSwashCaps-Regular',
    marginTop: 10,
    textAlign: 'center',
    color: '#34282C',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    // borderWidth: 1,
  },
  column: { flex: 1, flexDirection: 'column', justifyContent: 'space-between' },
  textBox: { fontSize: 19, fontFamily: 'serif', fontWeight: 'bold', width: 160 },
});
