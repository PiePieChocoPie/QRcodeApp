import axios from "axios";
import Store from "src/stores/mobx";

export async function getStorages(storageData: any): Promise<void> {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${process.env.baseUrl}/rest/414/wr0xw0v1im3i64fp/lists.element.get.json`,
      withCredentials: false,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        "FILTER": {
          "=ID": storageData
        },
        "IBLOCK_TYPE_ID": "lists",
        "IBLOCK_ID": "31"
      }
    };
  
    const response = await axios.request(config);
    Store.setUserStorage(response.data.result);
  }
  
  export async function getUserStoragesID(): Promise<boolean> {
    try {
      let data = JSON.stringify({ "filter": { "ENTITY_ID": 414 } });
      
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://bitrix24.martinural.ru/rest/527/z75y89aui0coqhoy/disk.storage.getlist',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic YXJtOlp4YzEyMw==',
        },
        data: data
      };
  
      await axios.request(config)
        .then((response) => {
          Store.setUserStorageData(response.data.result);
          return true;
        })
        .catch((error) => {
          console.log(error);
          return false;
        });
    } catch {
      return false;
    }
  }
  
  export async function getClients(GUID: string): Promise<any> {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${process.env.baseUrl}/MartinAPI/partners.php?GUID=${GUID}`,
      withCredentials: false
    };
  
    const response = await axios.request(config);
    // Store.setClients(response.data.body);
    return response;
  }
  