import AsyncStorage from '@react-native-async-storage/async-storage'

export const setData = async (key, list) => {
    try {
      const jsonValue = JSON.stringify(list);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      // ошибка сохранения данных
      console.error("ошибка сохранения данных")
    }
  };
  
export const getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // ошибка получения данных
      console.error("ошибка получения данных")
    }
  };

export async function getArrayFromStorage(key) {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Ошибка загрузки массива из AsyncStorage", e);
    return [];
  }
}

export async function addToArray(newObject) {
  try {
    const jsonArray = await AsyncStorage.getItem('scanDocArray');
    let array = jsonArray != null ? JSON.parse(jsonArray) : [];

    // Добавляем новый объект в массив
    array.push(newObject);

    // Сохраняем обновленный массив обратно в AsyncStorage
    await AsyncStorage.setItem('scanDocArray', JSON.stringify(array));
  } catch (error) {
    console.error('Ошибка при добавлении в массив:', error);
  }
}

export async function updateObjectInArray(key, objectId, updatedFields) {
  try {
    const array = await getArrayFromStorage(key);
    
    const index = array.findIndex(obj => JSON.stringify(obj.id_time.startsWith(objectId)));
    if (index !== -1) {
      array[index] = { ...array[index], ...updatedFields };
    }

    const jsonValue = JSON.stringify(array);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error("ошибка изменения объекта массива в AsyncStorage", e);
  }
}

export async  function findObjectById(id) {
  try {
    const jsonArray = await AsyncStorage.getItem('scanDocArray');
    let array = jsonArray != null ? JSON.parse(jsonArray) : [];

    // Поиск объекта по ID в массиве
    const foundObject = array.find(item => JSON.stringify(item.id_time.startsWith(id)));

    return foundObject;
  } catch (error) {
    console.error('Ошибка при поиске в массиве:', error);
  }
}
