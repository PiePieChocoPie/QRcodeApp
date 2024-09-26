import axios from "axios";
import Store from "src/stores/mobx";

export async function getTasksData(ID: string): Promise<any> {
    let data = JSON.stringify({
      "order": { "DEADLINE": "asc" },
      "filter": { "<REAL_STATUS": "5", "RESPONSIBLE_ID": ID }
    });
  
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${process.env.baseUrl}${process.env.token}tasks.task.list`,
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

  export async function getUpdById(id: string): Promise<any> {
    try {

        const data = JSON.stringify({
            "entityTypeId": 168,
            "filter": {
                "id": id
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

        // console.log("Request data:", data);

        const response = await axios.request(config);
        // console.log("Response data:", response.data); // Лог ответа

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
  
  
  export async function updUpdStatus(IDUpd: string, IDStatus: string, userID: string, commentValue:any,commentField:string, comment:string): Promise<any> {
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
    
    // console.log(body)
    const url = `${process.env.baseUrl}${process.env.token}crm.item.update`;
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
    const url = `${process.env.baseUrl}${process.env.token}crm.item.update`;
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
    const url = `${process.env.baseUrl}${process.env.token}crm.item.update`;
    return await axios.post(url, body);
  }
  
  export function getUserCurUpds(ID: string): Promise<any> {
    const body = {
      "entityTypeId": "168",
      "filter": { "assignedById": ID }
    };
    const url = `${process.env.baseUrl}${process.env.token}crm.item.list`;
    return axios.post(url, body);
  }
  
  export async function getUpdStatusesData(): Promise<any> {
    let data = JSON.stringify({ "entityId": "DYNAMIC_168_STAGE_9" });
  
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${process.env.baseUrl}${process.env.token}crm.status.entity.items`,
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
      url: `${process.env.baseUrl}${process.env.token}crm.status.entity.items`,
      headers: { 'Content-Type': 'application/json' },
      data: data,
      withCredentials: false
    };
  
    const response = await axios.request(config);
    Store.setItineraryStatusesData(response.data.result);
    return response;
  }
  
  export async function getAttorneyStatusesData(): Promise<any> {
    let data = JSON.stringify({ "entityId": "DYNAMIC_166_STAGE_16" });
  
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${process.env.baseUrl}${process.env.token}crm.status.entity.items`,
      headers: { 'Content-Type': 'application/json' },
      data: data,
      withCredentials: false
    };
  
    const response = await axios.request(config);
    Store.setAttorneyStatusesData(response.data.result);
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
        // console.log(JSON.stringify(response.data));
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
  
