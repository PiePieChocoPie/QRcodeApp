import axios from "axios";
import Store from "src/stores/mobx";
import { checkRecords } from "./func";

export async function getDataByToken(authToken: string): Promise<any> {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${process.env.baseUrl}/mobileControllers/dataByToken.php/?token=${authToken}`,
    headers: {
      'Authorization': `Basic ${authToken}`,
    },
    withCredentials: false
  };

  const response = await axios.request(config);
  Store.setUserData(response.data);
  
  let config2 = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${process.env.baseUrl}${process.env.NikitaToken}user.get.json?NAME=${Store.userData.NAME}&LAST_NAME=${Store.userData.LAST_NAME}`,
    withCredentials: false
  };
  
  const dataForPhoto = await axios.request(config2);
  Store.setUserPhoto(dataForPhoto.data.result[0].PERSONAL_PHOTO);
  
  return response;
}

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

export async function getTasksData(ID: string): Promise<any> {
  let data = JSON.stringify({
    "order": { "DEADLINE": "asc" },
    "filter": { "<REAL_STATUS": "5", "RESPONSIBLE_ID": ID }
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${process.env.baseUrl}${process.env.DanilaToken}tasks.task.list`,
    headers: { 'Content-Type': 'application/json' },
    data: data,
    withCredentials: false
  };

  const response = await axios.request(config);
  Store.setTaskData(response.data.result.tasks);
  return response;
}

export async function openDay(ID: string): Promise<string> {
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${process.env.baseUrl}/rest/597/9sxsabntxlt7pa2k/timeman.open?USER_ID=${ID}`,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: false
  };

  const response = await axios.request(config);
  return JSON.stringify(response.data);
}

export async function statusDay(ID: string): Promise<any> {
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${process.env.baseUrl}/rest/597/9sxsabntxlt7pa2k/timeman.status?USER_ID=${ID}`,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: false
  };

  const response = await axios.request(config);
  Store.setStatusWorkDay(response.data.result.STATUS);
  return response;
}

export async function getClients(GUID: string): Promise<any> {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${process.env.baseUrl}/MartinAPI/partners.php?GUID=${GUID}`,
    withCredentials: false
  };

  const response = await axios.request(config);
  Store.setClients(response.data.body);
  return response;
}

export async function getReports(): Promise<any> {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${process.env.baseUrl}/MartinAPI/API.php`,
    withCredentials: false
  };

  const response = await axios.request(config);
  return response;
}

export async function getUpdStatusesData(): Promise<any> {
  let data = JSON.stringify({ "entityId": "DYNAMIC_168_STAGE_9" });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${process.env.baseUrl}${process.env.DanilaToken}crm.status.entity.items`,
    headers: { 'Content-Type': 'application/json' },
    data: data,
    withCredentials: false
  };

  const response = await axios.request(config);
  Store.setUpdStatusesData(response.data.result);
  return response;
}

export async function getItineraryStatusesData(): Promise<any> {
  let data = JSON.stringify({ "entityId": "DYNAMIC_133_STAGE_10" });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${process.env.baseUrl}${process.env.DanilaToken}crm.status.entity.items`,
    headers: { 'Content-Type': 'application/json' },
    data: data,
    withCredentials: false
  };

  const response = await axios.request(config);
  Store.setItineraryStatusesData(response.data.result);
  return response;
}

export async function getAllStaticData(authToken: string, userData: boolean, depData: boolean, TaskData: boolean, docsStatuses: boolean): Promise<{status: boolean, curError: string}> {
  try {
    let status = true;
    let curError = "Неверная авторизация";
    
    if (userData) {
      await getDataByToken(authToken)
        .then(async () => {
          await getUserAttorney(true)
            .then(res => {
                if(res){
                    curError="Необходимо сдать доверенность!";
                    status=false;
                }
                console.log(res);
            })
            .catch(err => console.log(err));
        })
        .catch(error => {
          status = false;
        });
    }
    
    if (depData) {
      await getDepData(Store.userData.UF_DEPARTMENT[0])
        .catch(error => {
          curError = "Ошибка получения подразделения";
          status = false;
        });
    }
    
    if (TaskData) {
      await getTasksData(Store.userData.ID)
        .catch(error => {
          curError = "Ошибка получения задач пользователя";
          status = false;
        });
    }
    
    if (docsStatuses) {
      await getUpdStatusesData()
        .catch(error => {
          curError = "Ошибка получения статусов документов";
          status = false;
        });
    }
    
    if (docsStatuses) {
      await getItineraryStatusesData()
        .catch(error => {
          curError = "Ошибка получения статусов документов";
          status = false;
        });
    }
    
    return { status, curError };
  } catch (error) {
    return { status: false, curError: "Непредвиденная ошибка" };
  }
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

export async function getDataAboutDocs(raw: string): Promise<any> {
    return new Promise((resolve, reject) => {
        let data: any;
        let config: any;
        console.log(raw)
        if (raw.includes('133$')) {
            data = JSON.stringify({
                "entityTypeId": "133",
                "filter": {
                    "=ufCrm6Guid": raw
                }
            });
        } else if (raw.includes('168$')) {
            data = JSON.stringify({
                "entityTypeId": "168",
                "filter": {
                    "=ufCrm5ReleaceGuid": raw
                }
            });
        }

        config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://bitrix24.martinural.ru/rest/597/9sxsabntxlt7pa2k/crm.item.list',
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: false,
            data: data
        };
        console.log(data)
        axios.request(config)
            .then((response) => {
                // console.log(false, JSON.stringify(response.data));
                resolve(response); // Вернуть данные при успешном выполнении запроса
            })
            .catch((error) => {
                // console.log(123, error);
                reject(error); // Вернуть ошибку при возникновении ошибки
            });
    });
}


export function getUserCurUpds(ID: string): Promise<any> {
  const body = {
    "entityTypeId": "168",
    "filter": { "assignedById": ID }
  };
  const url = `${process.env.baseUrl}${process.env.DanilaToken}crm.item.list`;
  return axios.post(url, body);
}

export async function updUpdStatus(IDUpd: string, IDStatus: string, userID: string): Promise<any> {
  const body = {
    "entityTypeId": "168",
    "id": IDUpd,
    "fields": {
      "stageId": IDStatus,
      "updatedBy": userID,
      "assignedById": userID,
      "movedBy": userID
    }
  };
  console.log(body)
  const url = `${process.env.baseUrl}${process.env.DanilaToken}crm.item.update`;
  return await axios.post(url, body);
}

export async function updItineraryStatus(IDItinerary: string, IDStatus: string, userID: string): Promise<any> {
  const body = {
    "entityTypeId": "133",
    "id": IDItinerary,
    "fields": {
      "stageId": IDStatus,
      "updatedBy": userID,
      "movedBy": userID
    }
  };
  const url = `${process.env.baseUrl}${process.env.DanilaToken}crm.item.update`;
  return await axios.post(url, body);
}

export async function getUsersTrafficStatistics(Month: number, Year: number): Promise<any> {
  try {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${process.env.baseUrl}${process.env.DanilaToken}timeman.timecontrol.reports.get?MONTH=${Month}&YEAR=${Year}&USER_ID=${Store.userData.ID}`,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: false
    };

    const response = await axios.request(config);
    Store.setTrafficData(response.data.result.report.days);
    return response.data.result.report.days;
  } catch {
    return false;
  }
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

export async function getUserAttorney(onAuthorize:boolean): Promise<boolean> {
    try {
      let data = JSON.stringify({
        "entityTypeId": "166",
        "id": "91",
        "filter": {
          "ufCrm10ProxyResponsible": Store.userData.ID,
          "=stageId": "dt166_16:UC_NU0MRZ",
        },
        "select": [
            "ufCrm10ProxyResponsibleText",
            "ufCrm10ProxyNumber",
            "ufCrm10ProxySum",
            "ufCrm10ProxyValidityEnd",
            "ufCrm10ProxyDate"
          ]
        });
    
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://bitrix24.martinural.ru/rest/597/9sxsabntxlt7pa2k/crm.item.list',
            headers: { 'Content-Type': 'application/json' },
            withCredentials: false,
            data: data
        };
  
        const response = await axios.request(config);
        Store.setAttorneys(response.data.result.items);
        console.log('attprneys = ',Store.attorneys)
        if (onAuthorize&&response.data.total > 0) 
        {
            const items = response.data.result.items;
            console.log(items)
            const earliestItem = items.reduce((earliest, item) => {
            const itemDate = new Date(item.ufCrm10ProxyDate);
            if (!earliest || itemDate < new Date(earliest.ufCrm10ProxyDate)) {
                return item;
            }
            return earliest;
            }, null);
    
            if (earliestItem) {
            const attorneyDate = new Date(earliestItem.ufCrm10ProxyDate);
            const attorneyMonth = attorneyDate.getMonth() + 1;
            const attorneyYear = attorneyDate.getFullYear();
    
            const trafficData = await getUsersTrafficStatistics(attorneyMonth, attorneyYear);
            const nextTrafficData = await getUsersTrafficStatistics(attorneyMonth==12?1:attorneyMonth+1, attorneyMonth==12?attorneyYear+1:attorneyYear);
            console.log('Итем - ', earliestItem, '\n Трафик - ', Store.trafficData);
            const result = checkRecords(earliestItem.ufCrm10ProxyDate, trafficData,  nextTrafficData);
            console.log('блокируе - ', result ? 'True' : 'False');
            return result;
            }
        }
    } catch (error) {
      console.log(error);
      return false;
    }
    return false;
  }

export async function getReportsTest(jsonBody: any): Promise<string> {
  try {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://bitrix24.martinural.ru/Api1C/company_reports/default',
      headers: { 'Authorization': 'Basic VnZzOkV3cWF6MTIzNA==' },
      data: JSON.stringify(jsonBody),
      withCredentials: false
    };

    let response = await axios.request(config);
    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error(error);
    return error.toString();
  }
}

export async function getAttorneys(): Promise<any>{
    let data = JSON.stringify({
        "entityTypeId": "166",
        "id": "91",
        "filter": {
          "ufCrm10ProxyResponsible": Store.userData.ID,
          "=stageId": "dt166_16:UC_NU0MRZ"
        },
        "select": [
          "ufCrm10ProxyResponsibleText",
          "ufCrm10ProxyNumber",
          "ufCrm10ProxySum",
          "ufCrm10ProxyValidityEnd",
          "ufCrm10ProxyDate"
        ]
      });
      
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://bitrix24.martinural.ru/rest/597/9sxsabntxlt7pa2k/crm.item.list',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };
      
      axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
} 
