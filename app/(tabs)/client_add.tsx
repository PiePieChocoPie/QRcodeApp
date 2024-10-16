import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Button from 'src/components/button';
import { sendDataWithLocation } from 'src/func/add_users'; // Импорт функции

const YourComponent = () => {
  const [inputValue, setInputValue] = useState('');

  const handleButtonPress = () => {
    sendDataWithLocation(inputValue);
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Введите данные"
        value={inputValue}
        onChangeText={setInputValue}
      />
      <Button title="Добавить клиента" handlePress={handleButtonPress} />
    </View>
  );
};

const styles = StyleSheet.create({
    frameParent: {
        width: '90%',
        alignSelf: 'center',
        marginTop: '20%',
        justifyContent: 'flex-start',
    },
    inputContainer: {
        width: '100%',
        marginTop: '10%',
    },
    input: {
        backgroundColor: "#f7f8f9",
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 10,
        fontSize: 16,
        width: '100%',
    },
});

export default YourComponent;
