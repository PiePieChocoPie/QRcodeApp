import axios from "axios";
import Store from "src/stores/mobx"

export async function getDepData(ids: string[]): Promise<any> {
  let results = [];

  for (let ID of ids) {
    let data = { "ID": ID };

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${process.env.baseUrl}${process.env.token}department.get.json`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data,
      withCredentials: false
    };

    const response = await axios.request(config);
    let depData = response.data.result[0];
    Store.setDepData(depData);
    results.push(depData);
  }

  let isWarehouse = results.some(depData => depData.ID === '23' || depData.PARENT === '23');
  Store.setIsWarehouse(isWarehouse);

  return results;
}

  
  export async function getHierarchy(): Promise<any> {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://bitrix24.martinural.ru/MartinAPI/Hieralcy.php?param=${Store.userData.WORK_POSITION}`,
      headers: { 'Authorization': 'Basic arm:Zxc123' },
      withCredentials: false
    };
  
    const response = await axios.request(config);
    return response.data;
  }

  export async function getPhoneNumbersOfColleagues(): Promise<void> {
    // Формируем тело запроса. Если есть параметр "find", добавляем его в фильтр, иначе используем стандартный фильтр с "start"
    const Body = {
        'start':0,
        FILTER: {
            ">PERSONAL_MOBILE": "", // Фильтр по наличию мобильного номера
            "ACTIVE": true // Только активные пользователи
        }
    };
    
    // Конфигурация для запроса с использованием axios
    const config = {
        method: 'post', // Метод запроса POST
        maxBodyLength: Infinity, // Максимальная длина тела запроса (без ограничений)
        url: `${process.env.baseUrl}${process.env.token}user.search`, // URL для API с подставлением токена и baseUrl из окружения
        withCredentials: false, // Не используем креденшалы
        data: Body // Тело запроса
    };

    let sortedData = []; // Массив для хранения отсортированных данных
    let total = 1; // Общее количество записей (по умолчанию 1)

    try {
        // Выполняем первый запрос для получения данных
        const response = await axios.request(config);
        total = response.data.total; // Получаем общее количество записей
        sortedData = [...response.data.result]; // Сохраняем полученные записи

        // Если данных больше, чем мы получили за один запрос, продолжаем запрашивать остальные данные
        while (sortedData.length < total) {
            Body.start = sortedData.length;  // Обновляем значение "start" на основе текущей длины массива
            const responseOnCycle = await axios.request(config); // Выполняем следующий запрос
            total = responseOnCycle.data.total; // Обновляем общее количество записей (на случай, если оно изменилось)
            sortedData.push(...responseOnCycle.data.result); // Добавляем новые данные в массив
        }

        // Сортируем данные по фамилии (LAST_NAME) с использованием localeCompare для корректной сортировки строк
        sortedData.sort((c1, c2) => c1.LAST_NAME.localeCompare(c2.LAST_NAME));

        // Сохраняем данные в Store после того, как все данные были собраны и отсортированы
        Store.setColleaguesData(sortedData);
        console.log('кол-во',Store.colleaguesData.length); // Выводим количество сотрудников для проверки
        
    } catch (error) {
        // Обрабатываем ошибку, если произошел сбой при выполнении запроса
        console.error('Ошибка при получении номеров телефонов коллег:', error);
        // При необходимости можно дополнительно обработать ошибку или повторно выбросить её
    }
}