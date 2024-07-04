import axios from "axios";
import Store from "src/stores/mobx"

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
      url: 'https://bitrix24.martinural.ru/MartinAPI/Hieralcy.php',
      headers: { 'Authorization': 'Basic arm:Zxc123' },
      withCredentials: false
    };
  
    const response = await axios.request(config);
    return response.data;
  }
  