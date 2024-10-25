import * as Location from 'expo-location';
import axios from 'axios';
import Store from "src/stores/mobx";

export const sendDataWithLocation = async (clientNameValue, innValue) => {
  try {
    // Запрос разрешения на доступ к геолокации
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access location was denied');
    }

    // Получение текущей геолокации
    let location = await Location.getCurrentPositionAsync({});

    const data = JSON.stringify({
      fields:{
      TITLE: clientNameValue,
      UF_CRM_COMPANY_INN: innValue,
      ASSIGNED_BY_ID: Store.userData.ID,
      CREATED_BY_ID: Store.userData.ID,
      UF_CRM_COMPANY_LATITUDE: location.coords.latitude,
      UF_CRM_COMPANY_LONGITUDE: location.coords.longitude,
      }
    });

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://bitrix24.martinural.ru/rest/597/9nbjvw8amko6th3q/crm.company.add',
      headers: { 
        'Content-Type': 'application/json'
      },
      withCredentials: false,
      data : data
    };
    
    axios.request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      return 0;
    })
    .catch((error) => {
      console.log(error);
      return 1;
    });

    console.log('Данные успешно отправлены:', data);
  } catch (error) {
    console.error('Ошибка при отправке данных:', error.message);
    return 2;
  }
};
