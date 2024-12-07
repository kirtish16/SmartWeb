import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet,TouchableOpacity } from 'react-native';
import useTheme from '../utils/useTheme';

function isNullOrEmpty(str) {
  return str === undefined || str === null || str.trim() === '';
}

const InputPopup = ({ isVisible, onClose, onSubmit, webdata, onDelete }) => {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [showError, setShowError] = useState(false);
  const id = webdata?.id;
  const theme = useTheme();

  useEffect(() => {
    setShowError(false);
    if (webdata) {
      setInput1(webdata.name || '');
      setInput2(validateAndFixUrl(webdata.url) || '');
    }else{
      setInput1(null) ; 
      setInput2(null) ; 
    }
  }, [webdata, isVisible]);

  const validateAndFixUrl = (url) => {
    if (url) {
      if (url.startsWith('http://')) {
        return url.replace('http://', 'https://');
      } else if (!url.startsWith('https://')) {
        return `https://${url}`;
      }
    }
    return url;
  };

  const handleSubmit = () => {
    if (isNullOrEmpty(input1) || isNullOrEmpty(input2)) {
      setShowError(true);
      return;
    }
    setShowError(false);
    onSubmit({ input1, input2, id });
  };
  
  const handleDelete = () => {
    setShowError(false);
    onDelete(id);
  };

  const styles = getStyles(theme);
  
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.popupContainer}>
          <Text style={styles.text}>Enter details</Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.txtColor }]}
            placeholder="Name"
            value={input1}
            onChangeText={setInput1}
            placeholderTextColor={theme.colors.txtColor}
          />
          <TextInput
            style={[styles.input, { borderColor: theme.colors.txtColor }]}
            placeholder="URL"
            value={input2}
            onChangeText={setInput2}
            placeholderTextColor={theme.colors.txtColor}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
          {showError && <Text style={styles.errorText}>*Fields cannot be empty</Text>}
        </View>
      </View>
    </Modal>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    popupContainer: {
      backgroundColor: theme.colors.cmpColor,
      padding: 20,
      margin: 15,
      borderWidth: 1,
      borderColor: theme.colors.txtColor,
      borderRadius: 10,
    },
    headingText: {
      color: theme.colors.txtColor,
      fontSize: 20, // Larger font size for heading
      fontWeight: 'bold',
      marginBottom: 15,
    },
    fieldText: {
      color: theme.colors.txtColor, 
      fontSize: 16, // Smaller than heading
      marginBottom: 10,
    },
    input: {
      borderBottomWidth: 1,
      marginBottom: 10,
      color: theme.colors.txtColor,
      fontSize: 16,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
      width: '100%',
      marginTop: 10,
    },
    button: {
      flex: 1,
      marginHorizontal: 5,
      paddingVertical: 10,
      alignItems: 'center',
      borderRadius: 5,
    },
    saveButton: {
      backgroundColor: '#4CAF50', // Green for Save
    },
    cancelButton: {
      backgroundColor: '#f0ad4e', // Yellow/Orange for Cancel
    },
    deleteButton: {
      backgroundColor: '#d9534f', // Red for Delete
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 14,
    },
    errorText: {
      color: 'red',
      marginTop: 10,
      fontSize: 14,
    },
  });

export default InputPopup;