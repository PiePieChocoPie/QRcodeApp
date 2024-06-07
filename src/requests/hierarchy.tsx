import axios from "axios";
import Store from "src/stores/mobx"

export async function getDepData(ID: string): Promise<any> {
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
    Store.setDepData(response.data.result[0]);
    return response;
  }
  
  export async function getHierarchy(): Promise<any> {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://bitrix24.martinural.ru/MartinAPI/Hieralcy.php',
      headers: { 'Authorization': 'Basic arm:Zxc123' },
    };
  
    const response = await axios.request(config);
    return response;
  }
  