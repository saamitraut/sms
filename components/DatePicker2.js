import React, {useState} from 'react';
import Icon1 from 'react-native-vector-icons/Feather';
import DatePicker from 'react-native-date-picker';

export default ({update}) => {
  //   const [updatedon, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  return (
    <>
      <Icon1
        name={'calendar'}
        size={50}
        color={'#6699cc'}
        style={{flex: 1, marginTop: 20}}
        onPress={() => {
          setOpen(true);
          alert('hello');
        }}
      />
      <DatePicker
        modal
        open={open}
        date={new Date()}
        mode={'date'}
        onConfirm={date => {
          setOpen(false);
          // console.log(date);
          //   setDate(date);
          update(date);
          // getData();
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </>
  );
};
