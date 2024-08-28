import axios from "axios";
import Store from "src/stores/mobx";
import * as SecureStore from 'expo-secure-store';
import { setData } from "src/stores/asyncStorage";


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
  

  export async function getDataAboutDocs(raw: string): Promise<any> {
      try {
          let entityTypeId: string | null = null;
  
          switch (true) {
              case raw.startsWith('133$'):
                  entityTypeId = "133";
                  break;
              case raw.startsWith('168$'):
                  entityTypeId = "168";
                  break;
              case raw.startsWith('166$'):
                  entityTypeId = "166";
                  break;
              default:
                  throw new Error("Invalid raw string format");
          }
  
          if (!entityTypeId) {
              throw new Error("Invalid entity type ID");
          }
  
          const data = JSON.stringify({
              "entityTypeId": entityTypeId,
              "filter": {
                  [entityTypeId === "133" ? "=ufCrm6Guid" : entityTypeId === "168" ? "=ufCrm5ReleaceGuid" : "=ufCrm10ProxyGuid"]: raw
              }
          });
  
          const config = {
              method: 'post',
              maxBodyLength: Infinity,
              url: 'https://bitrix24.martinural.ru/rest/597/9sxsabntxlt7pa2k/crm.item.list',
              headers: {
                  'Content-Type': 'application/json',
              },
              withCredentials: false,
              data: data
          };
  
          console.log("Request data:", data);
  
          const response = await axios.request(config);
          console.log("Response data:", response.data); // Лог ответа
  
          if (response.data && response.data.result && response.data.result.items) {
              // console.log("First item:", response.data.result.items[0]);
          } else {
              console.error('Invalid response structure:', response.data);
          }
  
          return response.data;
      } catch (error) {
          console.error('Error fetching data:', error);
          throw error;
      }
  }
  
  
  export async function updUpdStatus(IDUpd: string, IDStatus: string, userID: string, commentValue?:any,commentField?:string, comment?:string): Promise<any> {
    let currentDate = new Date()
    const body = {
      entityTypeId: "168",
      "id": IDUpd,
      "fields": {
        "stageId": IDStatus,
        "updatedBy": userID,
        "assignedById": userID,
        "movedBy": userID,
        [commentField]: commentValue.ID=="78"?comment:commentValue.VALUE,
        "ufCrm5AcceptStatusList":commentValue.ID
      }
    };
    if (IDStatus == "DT168_9:UC_YAHBD0") {
      body.fields.ufCrm5DocScannedTime = currentDate;
    }
    // console.log(body)
    const url = `${process.env.baseUrl}${process.env.DanilaToken}crm.item.update`;
    return await axios.post(url, body);
  }
  
  export async function updAttorneyStatus(IDAttorney: string, IDStatus: string, userID: string): Promise<any> {
    const body = {
      "entityTypeId": "166",
      "id": IDAttorney,
      "fields": {
        "stageId": IDStatus,
        "updatedBy": userID,
        "assignedById": userID,
        "movedBy": userID
      }
    };
    // console.log(body)
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
  
  export async function getUserCurUpds(ID: string): Promise<any> {
    const body = {
      "entityTypeId": "168",
      "filter": { "assignedById": ID }
    };
    const url = `${process.env.baseUrl}${process.env.DanilaToken}crm.item.list`;
    return await axios.post(url, body);
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
    await setData('updStatusesData', JSON.stringify(response.data));
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
    await setData('itineraryStatusesData', JSON.stringify(response.data));
    return response;
  }
  
  export async function getAttorneyStatusesData(): Promise<any> {
    let data = JSON.stringify({ "entityId": "DYNAMIC_166_STAGE_16" });
  
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${process.env.baseUrl}${process.env.DanilaToken}crm.status.entity.items`,
      headers: { 'Content-Type': 'application/json' },
      data: data,
      withCredentials: false
    };
  
    const response = await axios.request(config);
    await setData('attorneyStatusesData', JSON.stringify(response.data));

    return response;
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
        //console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
} 

export async function getReportsTest(jsonBody: any): Promise<string> {
  try {
      let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://bitrix24.martinural.ru/Api1C/company_reports/with_link',
          headers: { 'Authorization': 'Basic VnZzOkV3cWF6MTIzNA==' },
          data: jsonBody,
          withCredentials: false
      };

      let response:any = await axios.request(config);
      console.log(response)
      // let FileId = response.fileId;

      console.log("Response data: " + JSON.stringify(response.data));

      let fileId = response.data.fileId;

      console.log("fileId" + fileId)

      let downloadingResponse = await axios.get(`https://bitrix24.martinural.ru/rest/527/i2jz9ji70u21wjgg/disk.file.get?id=${fileId}`);
      
      console.log("link = " + JSON.stringify(downloadingResponse.data))
      let downloadUrl = downloadingResponse.data.result.DOWNLOAD_URL;

      // Return the download URL
      return downloadUrl;
      // return downloadingResponse;
  } catch (error) {
      console.error(error);
      return error.toString();
  }
}

  export async function getUpdRejectStatuses():Promise<Array<any>>{
    try{
        let config={
            method:"post",
            maxBodyLength: Infinity,
            url:"https://bitrix24.martinural.ru/rest/597/9sxsabntxlt7pa2k/crm.item.fields",
            data:{
                "entityTypeId": "168"
            },
            withCredentials: false
        }
        let response = await axios.request(config);
        return response.data.result.fields.ufCrm5AcceptStatusList.items;
    }
    catch (err){
        console.log(err);
        return [];
    }
  }
  
  export async function getNextStatus(docData:any) {
    if (!docData) return { error: 'Изменение статуса документа невозможно' };
    if (!docData.stageId) return { error: 'Изменение статуса документа невозможно' };
    let statuses;
    const curStatus = docData.stageId;

    if (docData.typeId == '168'&&((Store.isWarehouse&&(docData.stageId=="DT168_9:NEW"||docData.stageId=="DT168_9:CLIENT")||
          (docData.ufCrm5Driver==Store.userData.ID&&(docData.stageId=="DT168_9:UC_YAHBD0"||docData.stageId=="DT168_9:UC_9ARBA5"))))) {
      statuses=Store.updStatusesData;
      for (let i = 0; i < statuses.updStatuses.length; i++) {
        if (statuses.updStatuses[i].STATUS_ID === curStatus && i !== statuses.updStatuses.length - 2) {
          return statuses.updStatuses[i + 1];
        }
      }
    } else if (docData.typeId=='133' && (docData.ufCrm6Driver == Store.userData.ID || Store.isWarehouse && curStatus === 'DT133_10:PREPARATION')) {
      statuses=Store.itineraryStatusesData;
      for (let i = 0; i < statuses.itineraryStatuses.length; i++) {
        if (statuses.itineraryStatuses[i].STATUS_ID === curStatus) {
          return statuses.itineraryStatuses[i + 1];
        }
      }
    } else if (docData.typeId === '166') {
      statuses=Store.attorneyStatusesData;
      let i = statuses.attorneyStatuses.length;
      return statuses.attorneyStatuses[i - 2];
    }

    return { error: 'Изменение статуса документа невозможно' };
  };
