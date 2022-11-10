import React, {Component} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import DatePicker2 from '../../components/DatePicker2';

class AddEmployeeModal extends Component {
  constructor(props) {
    super(props);
    // console.log(props);
    this.state = {
      engineerid: props.engineerId,
      reason: '',
      description: '',
      startdate: '',
      enddate: '',
      loading: false,
      errorMessage: '',
    };
  }

  handleChange = (value, state) => {
    this.setState({[state]: value});
  };

  addEmployee = () => {
    // destructure state
    const {engineerid, reason, description, startdate, enddate} = this.state;
    this.setState({errorMessage: '', loading: true});

    if (engineerid && reason && description && startdate && enddate) {
      var data = new FormData();
      data.append('engineerid', engineerid);
      data.append('reason', reason);
      data.append('description', description);
      data.append('startdate', startdate);
      data.append('enddate', enddate);
      //   console.log(data);

      fetch('http://103.219.0.103/sla/applyleave', {
        method: 'POST',
        body: data,
      })
        .then(res => res.json())
        .then(res => {
          this.props.closeModal();
          this.props.addEmployee({
            //
            id: res.result.id,
            NAME: res.result.NAME,
            startdate: res.result.startdate,
            enddate: res.result.enddate,
            Reason: res.result.Reason,
            Description: res.result.Description,
            approvedby: res.result.approvedby,
            Status: res.result.Status,
          });
        })
        .catch(() => {
          this.setState({
            errorMessage: 'Network Error. Please try again.',
            loading: false,
          });
        });
    } else {
      this.setState({errorMessage: 'Fields are empty.', loading: false});
    }
  };
  updateStartDate = date => {
    // console.log(date);
    this.setState({startdate: date.toISOString().slice(0, 10)}, () => {
      //   console.log(this.state);
    });
  };

  updateEndDate = date => {
    // console.log(date);
    this.setState({enddate: date.toISOString().slice(0, 10)}, () => {
      //   console.log(this.state);
    });
  };
  render() {
    const {isOpen, closeModal} = this.props;

    const {loading, errorMessage} = this.state;
    return (
      <Modal visible={isOpen} onRequestClose={closeModal} animationType="slide">
        <View style={styles.container}>
          <Text style={styles.title}>Add New Leave</Text>
          <TextInput
            style={styles.textBox}
            onChangeText={text => this.handleChange(text, 'reason')}
            placeholder="reason"
          />
          <TextInput
            style={styles.textBox}
            onChangeText={text => this.handleChange(text, 'description')}
            placeholder="description"
          />
          <View
            style={[
              styles.container,
              {
                flexDirection: 'row',
                justifyContent: 'space-between',
              },
            ]}>
            <TextInput placeholder="Start Date" value={this.state.startdate} />
            <DatePicker2 update={this.updateStartDate} />
            <TextInput placeholder="End Date" value={this.state.enddate} />
            <DatePicker2 update={this.updateEndDate} />
          </View>

          {loading ? (
            <Text style={styles.message}>Please Wait...</Text>
          ) : errorMessage ? (
            <Text style={styles.message}>{errorMessage}</Text>
          ) : null}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={this.addEmployee}
              style={{...styles.button, marginVertical: 0}}>
              <Text style={styles.buttonText}>Submit</Text>
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
      </Modal>
    );
  }
}

export default AddEmployeeModal;

const styles = StyleSheet.create({
  container: {
    padding: 15,
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
    fontSize: 16,
  },
});
