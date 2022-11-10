import React, {Component} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Button,
  Replyid,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';

class EditEmployeeModal extends Component {
  constructor(props) {
    //
    super(props);

    this.state = {
      FormNo: '',
      CustomerId: '',
      subscriberid: '',
      MobileNo: '',
      email: '',
      SubscriberTypeId: 0,
      Address: '',
      Zipcode: '',
      OperatorId: '',
      FName: '',
      Mname: '',
      LName: '',
      loading: false,
      errorMessage: '',
      showclear: false,
      pincode: '',
    };
  }

  componentDidMount() {
    const {
      FormNo,
      CustomerId,
      subscriberid,
      MobileNo,
      email,
      SubscriberTypeId,
      Address,
      Zipcode,
      OperatorId,
      FName,
      Mname,
      LName,
    } = this.props.selectedEmployee;

    this.setState({
      FormNo: FormNo,
      CustomerId: CustomerId,
      subscriberid: subscriberid,
      MobileNo: MobileNo,
      email: email,
      SubscriberTypeId: SubscriberTypeId,
      Address: Address,
      Zipcode: Zipcode,
      OperatorId: OperatorId,
      FName: FName,
      Mname: Mname,
      LName: LName,
    });
  }

  handleChange = (value, state) => {
    this.setState({[state]: value});
  };

  updateEmployee = () => {
    // console.log('state in updateEmployee');// console.log(this.state);// return;// alert(JSON.stringify(this.state));
    const {
      FormNo,
      CustomerId,
      subscriberid,
      MobileNo,
      email,
      SubscriberTypeId,
      Address,
      Zipcode,
      OperatorId,
      FName,
      Mname,
      LName,
    } = this.state;
    this.setState({errorMessage: '', loading: true});

    if (SubscriberTypeId != '') {
      // selected employee is updated with employee id
      var data = new FormData();
      data.append('FormNo', FormNo);
      data.append('CustomerId', CustomerId);
      data.append('subscriberid', subscriberid);
      data.append('MobileNo', MobileNo);
      data.append('email', email);
      data.append('SubscriberTypeId', SubscriberTypeId);
      data.append('Address', Address);
      data.append('Zipcode', Zipcode);
      data.append('OperatorId', OperatorId);
      data.append('FName', FName);
      data.append('Mname', Mname);
      data.append('LName', LName);
      data.append('updatedby', 1);
      // alert(JSON.stringify(data));      return;
      const updateAPIURL =
        'http://103.219.0.103/sla/updateSubscriberDetails.php';

      fetch(updateAPIURL, {
        method: 'POST',

        body: data,
      })
        .then(res => res.json())
        .then(res => {
          //
          console.log(JSON.stringify(res));
          if (res.status) {
            this.props.closeModal();
            this.props.updateEmployee(res.data);
            // alert(res.msg);
          } else {
            alert(res.msg);
          }
        })
        .catch(() =>
          this.setState({
            loading: false,
            errorMessage: 'Network Error. Please try again.',
          }),
        );
    } else {
      this.setState({errorMessage: 'Fields are empty.', loading: false});
    }
  };

  render() {
    const {isOpen, closeModal} = this.props;
    const {
      FormNo,
      CustomerId,
      subscriberid,
      MobileNo,
      email,
      SubscriberTypeId,
      Address,
      Zipcode,
      OperatorId,
      FName,
      Mname,
      LName,
      loading,
      errorMessage,
    } = this.state;
    // console.log(this.state);
    return (
      <Modal
        propagateSwipe={true}
        visible={isOpen}
        onRequestClose={closeModal}
        animationType="slide">
        <ScrollView>
          <View style={[styles.container]}>
            <Text style={styles.title}>Update Subscriber Details</Text>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{flex: 1, padding: 10}}>
                <Text style={styles.title2}>FormNo:</Text>
                <TextInput
                  editable={false}
                  defaultValue={FormNo}
                  style={styles.textBox}
                  placeholder="FormNo"
                />
              </View>

              <View style={{flex: 1, padding: 10}}>
                <Text style={styles.title2}>CustomerId:</Text>
                <TextInput
                  editable={false}
                  defaultValue={CustomerId}
                  style={styles.textBox}
                  placeholder="CustomerId"
                />
              </View>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{flex: 1, padding: 10}}>
                <Text style={styles.title2}>subscriberid:</Text>
                <TextInput
                  editable={false}
                  defaultValue={subscriberid}
                  style={styles.textBox}
                  placeholder="subscriberid"
                />
              </View>
              <View style={{flex: 1, padding: 10}}>
                <Text style={styles.title2}>MobileNo:</Text>
                <TextInput
                  editable={true}
                  defaultValue={MobileNo}
                  style={styles.textBox}
                  placeholder="MobileNo"
                  onChangeText={text => this.handleChange(text, 'MobileNo')}
                />
              </View>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
              <View style={{flex: 1, padding: 10}}>
                <Text style={styles.title2}>email:</Text>
                <TextInput
                  editable={true}
                  defaultValue={email}
                  onChangeText={text => this.handleChange(text, 'email')}
                  style={styles.textBox}
                  placeholder="email"
                />
              </View>
              <View style={{flex: 1, padding: 10}}>
                <Text style={styles.title2}>Pin Code:</Text>
                <TextInput
                  defaultValue={Zipcode}
                  style={styles.textBox}
                  onChangeText={text => this.handleChange(text, 'Zipcode')}
                  placeholder="Zipcode"
                />
              </View>
            </View>

            <TextInput
              defaultValue={OperatorId}
              style={[styles.textBox, {display: 'none'}]}
              onChangeText={text => this.handleChange(text, 'OperatorId')}
              placeholder="OperatorId"
            />

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{flex: 1, padding: 10}}>
                <Text style={styles.title2}>SubscriberType:</Text>
                <Picker
                  selectedValue={SubscriberTypeId}
                  onValueChange={text =>
                    this.handleChange(text, 'SubscriberTypeId')
                  }>
                  <Picker.Item label="Select SubscriberType " value="" />
                  <Picker.Item label="Residential" value="1" />
                  <Picker.Item label="Commercial" value="2" />
                  <Picker.Item label="Government" value="3" />
                </Picker>
              </View>
            </View>
            {/* <TouchableOpacity
              onPress={this.sendConfirmationOTP}
              style={styles.button}>
              <Text style={styles.buttonText}>CONFIRMATION OTP</Text>
            </TouchableOpacity> */}

            {loading ? (
              <Text style={styles.message}>Please Wait...</Text>
            ) : errorMessage ? (
              <Text style={styles.message}>{errorMessage}</Text>
            ) : null}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={this.updateEmployee}
                style={{...styles.button, marginVertical: 0}}>
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>

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
        </ScrollView>
      </Modal>
    );
  }
}
export default EditEmployeeModal;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
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
  },
  message: {
    color: 'tomato',
    fontSize: 17,
  },
  title2: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 15,
    color: '#37859b',
  },
  title3: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 5,
    color: '#eca1a6',
  },
});
