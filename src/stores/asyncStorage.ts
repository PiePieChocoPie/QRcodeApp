import AsyncStorage from '@react-native-async-storage/async-storage'

// Сохранение списка
export const setData = async (key, list) => {
    try {
      const jsonValue = JSON.stringify(list);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      // ошибка сохранения данных
    }
  };
  
  // Получение списка
export const getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // ошибка получения данных
    }
  };