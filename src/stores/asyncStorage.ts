import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Сохраняет данные по ключу в AsyncStorage.
 * @param {string} key - Ключ для сохранения данных.
 * @param {Array} list - Массив, который нужно сохранить.
 */
export const setData = async (key, list) => {
  try {
    const jsonValue = JSON.stringify(list);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error("Ошибка сохранения данных:", e);
  }
};

/**
 * Извлекает данные по ключу из AsyncStorage.
 * @param {string} key - Ключ для извлечения данных.
 * @returns {Array|null} - Возвращает массив данных или null, если данных нет.
 */
export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Ошибка получения данных:", e);
  }
};

/**
 * Извлекает массив объектов из AsyncStorage.
 * @param {string} key - Ключ для извлечения данных.
 * @returns {Array} - Возвращает массив объектов или пустой массив, если данных нет.
 */
export async function getArrayFromStorage(key) {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Ошибка загрузки массива из AsyncStorage:", e);
    return [];
  }
}

/**
 * Добавляет новый объект в массив, хранящийся в AsyncStorage.
 * @param {Object} newObject - Объект, который нужно добавить.
 */
export async function addToArray(newObject) {
  try {
    const jsonArray = await AsyncStorage.getItem('scanDocArray');
    const array = jsonArray != null ? JSON.parse(jsonArray) : [];

    array.push(newObject);

    await AsyncStorage.setItem('scanDocArray', JSON.stringify(array));
  } catch (error) {
    console.error('Ошибка при добавлении в массив:', error);
  }
}

/**
 * Обновляет объект в массиве по его ID в AsyncStorage.
 * @param {string} key - Ключ для извлечения данных.
 * @param {string} objectId - ID объекта для поиска.
 * @param {Object} updatedFields - Поля, которые нужно обновить в найденном объекте.
 */
export async function updateObjectInArray(key, objectId, updatedFields) {
  try {
    const array = await getArrayFromStorage(key);
    
    // Поиск объекта по ID
    const index = array.findIndex(obj => obj.id_time.startsWith(`${objectId}_`));
    if (index !== -1) {
      array[index] = { ...array[index], ...updatedFields }; // Обновление найденного объекта
    }

    await AsyncStorage.setItem(key, JSON.stringify(array));
  } catch (e) {
    console.error("Ошибка изменения объекта массива в AsyncStorage:", e);
  }
}

/**
 * Находит объект по ID в массиве, хранящемся в AsyncStorage.
 * @param {string} id - ID объекта для поиска.
 * @returns {Object|null} - Найденный объект или null, если объект не найден.
 */
export async function findObjectById(id) {
  try {
    const jsonArray = await AsyncStorage.getItem('scanDocArray');
    const array = jsonArray != null ? JSON.parse(jsonArray) : [];

    const foundObject = array.find(item => item.id_time.startsWith(`${id}_`));

    return foundObject || null;
  } catch (error) {
    console.error('Ошибка при поиске в массиве:', error);
    return null;
  }
}
