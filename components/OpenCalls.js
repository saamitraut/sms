import React, {Component} from 'react';
import Icon1 from 'react-native-vector-icons/Feather';
//

export default class OpenCalls extends Component {
  constructor(props) {
    super(props);
    // console.log(props);
  }

  getData = () => {
    this.props.params.hideError();

    var data = new FormData();
    data.append('status', 1);
    data.append('EngineerId', this.props.params.engineerId);

    const InsertAPIURL = 'http://103.219.0.103/sla/getCallDetails.php'; //

    fetch(InsertAPIURL, {
      method: 'POST',
      body: data,
    })
      .then(res => res.json())
      .then(res => {
        // console.log(res.data);
        this.props.params.updateStateCalls(res.data);
      })
      .catch(() => this.props.params.showError());
  };
  render() {
    return (
      <Icon1
        name={'phone-call'}
        size={50}
        color={'#6699cc'}
        style={{flex: 1, marginTop: 20, marginHorizontal: 5}}
        onPress={() => {
          this.getData();
          this.props.params.updateStatus(1);
        }}
      />
    );
  }
}
