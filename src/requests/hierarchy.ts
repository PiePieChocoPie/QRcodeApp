import axios from "axios";
import Store from "src/stores/mobx"
import {setData} from 'src/stores/asyncStorage'


export async function getDepData(ids: string[]): Promise<any> {
  let results = [];

  for (let ID of ids) {
    let data = { "ID": ID };

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${process.env.baseUrl}${process.env.NikitaToken}department.get.json`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data,
      withCredentials: false
    };

    const response = await axios.request(config);
    let depData = response.data.result[0];
    await setData('depData', JSON.stringify(response.data));
    results.push(depData);
  }

  let isWarehouse = results.some(depData => depData.ID === '23' || depData.PARENT === '23');
  await setData('isWarehouse', JSON.stringify(isWarehouse));

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
  