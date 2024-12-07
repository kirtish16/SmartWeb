import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';

const FloatingButton = ({onPress, icon}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      {icon}
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: '#2196F3',
    borderRadius: 50,
    height:60,
    width:60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FloatingButton;
