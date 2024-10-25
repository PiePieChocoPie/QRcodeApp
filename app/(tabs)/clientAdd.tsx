import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Button from 'src/components/button';
import { sendDataWithLocation } from 'src/func/add_users'; // Импорт функции
import { usePopupContext } from 'src/PopupContext';

const clientAdd = () => {
  const [innValue, setInnValue] = useState('');
  const [clientNameValue, setClientNameValue] = useState('');
  const { showPopup } = usePopupContext();

  const handleButtonPress = () => {
    let result = innValue!=''&&clientNameValue!=''&&innValue.length==12?sendDataWithLocation(clientNameValue, innValue):2;
    console.log(result)
    // switch(result){
    //   case 0:
    //   showPopup(`Добавлен клиент: ${clientNameValue}`, 'success');
    //   case 1:
    //   showPopup(`Ошибка создания клиента: ${clientNameValue}`, 'error');
    //   default:
    //   showPopup(`Ошибка создания клиента: ${clientNameValue}`, 'error');
    // }
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Введите название"
        value={clientNameValue}
        onChangeText={setClientNameValue}
      />
      <TextInput
        style={styles.input}
        placeholder="Введите ИНН"
        value={innValue}
        onChangeText={setInnValue}
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

export default clientAdd;
