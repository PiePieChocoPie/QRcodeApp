import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import Store from "src/stores/mobx";

const ScanStory = () => {
  const [userCodes, setUserCodes] = useState(Store.userCodes);

  const copyToClipboard = async (data) => {
    await Clipboard.setStringAsync(data); // Копируем строку в буфер обмена
    console.log('Скопировано в буфер обмена!'); // Уведомление о копировании
  };

  const removeUserCode = (id, data) => {
    Store.removeUserCode(id, data); // Удаляем код из Store
    // Обновляем локальное состояние
    setUserCodes(Store.userCodes.filter(item => !(item.id === id && item.data === data)));
  };

  const renderItem = ({ item }) => (
      <View style={styles.itemContainer}>
          <Text style={[styles.Text, { color: 'black' }]}>{item.data}</Text>
          <TouchableOpacity onPress={() => copyToClipboard(item.data)}>
              <Text style={[styles.Text, { color: 'blue' }]}>копировать</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => removeUserCode(item.id, item.data)}>
              <Text style={[styles.Text, { color: 'red' }]}>Удалить</Text>
          </TouchableOpacity>
      </View>
  );


  return (
      <View style={styles.container}>
          <FlatList
              data={userCodes}
              renderItem={renderItem}
              keyExtractor={(item) => `${item.id}:${item.data}`} // Используйте уникальный ключ
          />
      </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    itemContainer: {
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    Text: {
        fontSize: 18,
        margin: 5,
        textAlign: 'center'
    },
});

export default ScanStory;