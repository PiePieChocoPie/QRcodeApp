import * as Location from 'expo-location';
import axios from 'axios';
import { store } from 'expo-router/build/global-state/router-store';
import Store from "src/stores/mobx";

export const sendDataWithLocation = async (inputValue) => {
  try {
    // Запрос разрешения на доступ к геолокации
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access location was denied');
    }

    // Получение текущей геолокации
    let location = await Location.getCurrentPositionAsync({});

    const dataToSend = {
      input: inputValue,
      delegate_id: Store.userData.ID,
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    };

    // Пример отправки данных на сервер
    // await axios.post('https://your-server-url.com/api/send', dataToSend);

    console.log('Данные успешно отправлены:', dataToSend);
  } catch (error) {
    console.error('Ошибка при отправке данных:', error.message);
  }
};
