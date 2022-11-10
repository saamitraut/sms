import React, {Component} from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StyleSheet,
  //
  TouchableOpacity,
  Linking,
} from 'react-native';
import AddEmployeeModal from './AddEmployeeModal';
import EditEmployeeModal from './EditEmployeeModal';
import DeleteEmployeeModal from './deleteEmployeeModal';

class App extends Component {
  //
  constructor(props) {
    super(props);
    const {loggedinDetails, status} = props.route.params;
    const {email, engineerId, fullName, userid} = loggedinDetails;

    this.state = {
      leaves: [],
      isAddEmployeeModalOpen: false,
      isEditEmployeeModalOpen: false,
      isDeleteEmployeeModalOpen: false,
      loading: false,
      errorMessage: '',
      selectedEmployee: {},
      deviceId: '',
      loggedinDetails: {},
      email: email,
      engineerId: engineerId,
      fullName: fullName,
    };
  }
  operators = [];
  SubscriberTypes = ['', 'Residential', 'Commercial', 'Government'];
  getOperators = () => {
    var data = new FormData();

    data.append('debug', 0);

    const APIURL = 'http://103.219.0.103/sla/getOperatorDetails.php';

    fetch(APIURL, {
      method: 'POST',
      body: data,
    })
      .then(res => res.json())
      .then(res => {
        this.operators = res.data;
        // console.log('operators on line 57 leaves appl');
        // console.log(res);
      });
  };

  componentDidMount() {
    this.getData({engineerId: this.state.engineerId});
    this.getOperators();
  }

  getData = props => {
    this.setState({errorMessage: '', loading: true});
    var data = new FormData();
    data.append('engineerid', props.engineerId);

    const APIURL = 'http://103.219.0.103/sla/getAttendanceDetails.php';
    fetch(APIURL, {
      method: 'POST',
      body: data,
    })
      .then(res => res.json())
      .then(res => {
        // console.log('hello');
        this.setState({
          leaves: res.data,
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

  toggleAddEmployeeModal = () => {
    this.setState({isAddEmployeeModalOpen: !this.state.isAddEmployeeModalOpen});
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

  //

  addEmployee = data => {
    // this.state.employee array is seprated into object by rest operator
    this.setState({leaves: [data, ...this.state.leaves]});
  };

  updateEmployee = data => {
    // updating employee data with updated data if employee id is matched with updated data id

    this.setState({
      leaves: this.state.leaves.map(leave =>
        leave.leaveid == data.leaveid ? data : leave,
      ),
    });
  };

  deleteEmployee = employeeId => {
    // delete employee lsit with deleted data if employee id is matched with updated data id
    this.setState({
      employee: this.state.employee.filter(emp => emp.id !== employeeId),
    });
  };

  render() {
    const {
      loading,
      errorMessage,
      employee,
      isAddEmployeeModalOpen,
      isEditEmployeeModalOpen,
      isDeleteEmployeeModalOpen,
      selectedEmployee,
    } = this.state;

    // this.getData({engineerId: this.state.engineerId});

    return (
      <ScrollView>
        <View style={styles.container}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={this.toggleAddEmployeeModal}
              style={styles.button}>
              <Text style={styles.buttonText}>Add Leave</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.getData({engineerId: this.state.engineerId});
              }}
              style={styles.button}>
              <Text style={styles.buttonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
          {this.state.leaves != undefined ? (
            <View>
              {this.state.loading && (
                <Text style={styles.title}>Please wait</Text>
              )}
              <Text>Total leaves {this.state.leaves.length}</Text>
              <Text style={styles.title}>Leaves</Text>
              {/* <Text>{JSON.stringify(this.state.leaves)}</Text> */}
              {this.state.leaves.map((leave, index) => (
                <View style={styles.employeeListContainer} key={leave.id}>
                  <Text style={{...styles.listItem, color: 'tomato'}}>
                    {index + 1}.
                  </Text>
                  <Text style={styles.name}>{leave.NAME}</Text>
                  <Text style={styles.listItem}>
                    StartDate: {leave.startdate}
                  </Text>
                  <Text style={styles.listItem}>EndDate: {leave.enddate}</Text>
                  <Text style={styles.listItem}>Reason: {leave.Reason}</Text>
                  {/* <Text style={styles.listItem}>Status: {leave.Status}</Text> */}
                  <Text style={styles.listItem}>
                    {leave.Status == 1 ? 'Approved' : ''}
                    {leave.Status == 0 ? 'Pending' : ''}
                    {leave.Status == 2 ? 'Rejected' : ''}
                  </Text>
                  <Text style={styles.listItem}>
                    {leave.Status == 1 ? 'Approved By ' : ''}
                    {leave.Status == 2 ? 'Rejected By ' : ''}
                    {leave.approvedby}
                  </Text>
                </View>
              ))}
              {/* AddEmployeeModal modal is open when add employee button is clicked */}
              {isAddEmployeeModalOpen ? (
                <AddEmployeeModal
                  isOpen={isAddEmployeeModalOpen}
                  closeModal={this.toggleAddEmployeeModal}
                  addEmployee={this.addEmployee}
                  engineerId={this.state.engineerId}
                />
              ) : null}

              {isEditEmployeeModalOpen ? (
                <EditEmployeeModal
                  isOpen={isEditEmployeeModalOpen}
                  closeModal={this.toggleEditEmployeeModal}
                  selectedEmployee={selectedEmployee}
                  updateEmployee={this.updateEmployee}
                />
              ) : null}
            </View>
          ) : (
            <Text>No leaves</Text>
          )}
        </View>
      </ScrollView>
    );
  }
}

export default App;
//

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
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
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
  },
  title2: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
    color: '#000000',
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
    fontSize: 16,
  },
  listItem: {
    fontSize: 16,
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
  //
  row: {flex: 1, flexDirection: 'row', justifyContent: 'space-between'},
});
