import axios from "axios";
import Store from "src/stores/mobx";

export async function getDataByToken(authToken:string){
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

export async function getDepData(ID:string){
    let data = {    
        "ID": ID,
    };

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.baseUrl}${process.env.NikitaToken}department.get.json`,
        headers: { 

          'Content-Type': 'application/json'
        },
        data : data,
        withCredentials: false
      };
    const response = await axios.request(config)
    Store.setDepData(response.data.result[0]);   
    return response;
}

export async function getTasksData(ID:string){
    let data = JSON.stringify({
        "filter": {
            "<REAL_STATUS": "5",
            "RESPONSIBLE_ID": ID
        }
        });
        
        let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.baseUrl}${process.env.DanilaToken}tasks.task.list`,
        headers: { 
            'Content-Type': 'application/json', 
            
        },
        data : data,
        withCredentials: false
        };
        
    const response = await axios.request(config)    
    Store.setTaskData(response.data.result.tasks)
   
    return response;
}


export async function openDay(ID:string){
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.baseUrl}/rest/597/9sxsabntxlt7pa2k/timeman.open?USER_ID=${ID}`,
        headers: { 
            'Content-Type': 'application/json', 
            
        },
        withCredentials: false
    };
        
    const response = await axios.request(config)    
    return JSON.stringify(response.data);
}
export async function statusDay(ID:string){
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.baseUrl}/rest/597/9sxsabntxlt7pa2k/timeman.status?USER_ID=${ID}`,
        headers: { 
            'Content-Type': 'application/json', 
            
        },
        withCredentials: false
    };
        
    const response = await axios.request(config)    
    Store.setStatusWorkDay(response.data.result.STATUS);

    return response;
}

export async function getUpdStatusesData(){
    let data = JSON.stringify({
        "entityId": "DYNAMIC_168_STAGE_9",
        });
        
        let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.baseUrl}${process.env.DanilaToken}crm.status.entity.items`,
        headers: { 
            'Content-Type': 'application/json', 
        },
        data : data,
        withCredentials: false
        };
        
        const response = await axios.request(config)    
        Store.setUpdStatusesData(response.data.result);
        return response;
}

export async function getItineraryStatusesData(){
    let data = JSON.stringify({
        "entityId": "DYNAMIC_133_STAGE_10"
        });
        
        let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.baseUrl}${process.env.DanilaToken}crm.status.entity.items`,
        headers: { 
            'Content-Type': 'application/json', 
        },
        data : data,
        withCredentials: false
        };
        
        const response = await axios.request(config)    
        Store.setItineraryStatusesData(response.data.result);
        return response;

}
export async function getAllStaticData(authToken:string,userData: boolean, depData: boolean, TaskData: boolean, docsStatuses: boolean){
    try
    {
        let status = true,  curError = "Неверная авторизация";
        // //получение пользователя       
        if (userData) await getDataByToken(authToken)
            .then(async(response) => {
            })                                    
            .catch((error) => {
                //console.log(error);
                status = false;
            })
        
        if (depData) await getDepData(Store.userData.UF_DEPARTMENT[0])
            .then(async(response) => {
            })
            .catch((error) => {
                //console.log(error);
                curError = "Ошибка получения подразделения";
                status = false;
            });
        if(TaskData) await getTasksData(Store.userData.ID)
            .then(async(response) => {
               
                
            })
            .catch((error) => {
                //console.log(error);
        curError = "Ошибка получения задач пользователя";
                status = false;
            }); 
        if (docsStatuses) await getUpdStatusesData()
            .then(async(response) => {
            })
            .catch((error) => {
                //console.log(error);
        curError = "Ошибка получения статусов документов";
                status = false;                                        
            })
        if (docsStatuses) await getItineraryStatusesData()
            .then((response) => 
            {
            }) 
            .catch((error) => {
                //console.log(false,  error);
        curError = "Ошибка получения статусов документов";
                status = false;
            })     
        
        return {status: status, curError:curError};
    }
    catch(error)
    {
        //console.error;
        return {status: false, curError:"Непредвиденная ошибка"};
        // Alert.alert("ошибка", error);
    }
}


export async function getDataAboutDocs(raw:string){
    let body = {};
    let url = ``;
    if (raw.includes('$')) {
        body = {
            "entityTypeId": "133",
            "filter": {
                "=ufCrm6Guid": raw
            }
        }
    }
    else{
        body = {
            "entityTypeId": "168",
            "filter": {
                "=ufCrm5ReleaceGuid": raw
            }
        }
    }
    url = `${process.env.baseUrl}${process.env.DanilaToken}crm.item.list`;
        const response = await axios.post(url, body);
    return response;
}

export function  getUserCurUpds(ID:string){
    const body = {
        "entityTypeId": "168",
        "filter":{
            "assignedById":ID
        }
    }
    const url = `${process.env.baseUrl}${process.env.DanilaToken}crm.item.list`
    let req = axios.post(url,body);
    return req;
}


export async function  updUpdStatus(IDUpd:string,IDStatus:string, userID: string){
    const body = {
        "entityTypeId": "168",
        "id": IDUpd,
        "fields":{
            "stageId":IDStatus,
            "updatedBy": userID,
            "assignedById": userID,
            "movedBy": userID
        }
    }
    const url = `${process.env.baseUrl}${process.env.DanilaToken}crm.item.update`
    let req = await axios.post(url,body);
    return req;
}
export async function  updItineraryStatus(IDItinerary:string,IDStatus:string, userID: string){
    const body = {
        "entityTypeId": "133",
        "id": IDItinerary,
        "fields":{
            "stageId":IDStatus,
            "updatedBy": userID,
            "movedBy": userID
        }
    }
    const url = `${process.env.baseUrl}${process.env.DanilaToken}crm.item.update`
    let req = await axios.post(url,body);
    return req;
}

export async function getUsersTrafficStatistics(Month:number, Year:number){
    try{
        let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.baseUrl}${process.env.DanilaToken}timeman.timecontrol.reports.get?MONTH=${Month}&YEAR=${Year}&USER_ID=${Store.userData.ID}`,
        headers: { 
            'Content-Type': 'application/json', 
        },
        withCredentials: false
        };
        
        const response = await axios.request(config)    
        Store.setTrafficData(response.data.result.report.days)
        console.log(Store.trafficData)
        return true;
    }
    catch{
        return false;
    }
}