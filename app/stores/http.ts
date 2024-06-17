import axios from "axios";
import Store from "./mobx";

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
      return response;
}

export async function getDepData(ID:string){
    let data = {    
        "ID": ID,
    };

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.baseUrl}/rest/578/j919bucygnb3tdf9/department.get.json`,
        headers: { 

          'Content-Type': 'application/json'
        },
        data : data,
        withCredentials: false
      };
    const response = await axios.request(config)
    Store.setDepData(response.data);   
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
        url: `${process.env.baseUrl}/rest/597/9sxsabntxlt7pa2k/tasks.task.list`,
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

export async function getUpdStatusesData(){
    let data = JSON.stringify({
        "entityId": "DYNAMIC_168_STAGE_9",
        'Authorization': 'Basic YXJtOnp4YzEyMzQ1Ng==', 

        });
        
        let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.baseUrl}/rest/597/9sxsabntxlt7pa2k/crm.status.entity.items`,
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
        url: `${process.env.baseUrl}/rest/597/9sxsabntxlt7pa2k/crm.status.entity.items`,
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
        console.log("окружение - " +process.env.url)
        let status = true,  curError = "Неверная авторизация";
        // //получение пользователя       
        if (userData) await getDataByToken(authToken)
            .then(async(response) => {
                console.log(JSON.stringify(Store.userData));                
            })                                    
            .catch((error) => {
                console.log(error);
                status = false;
            })
        curError = "Ошибка получения подразделения";
        if (depData) await getDepData(Store.userData.UF_DEPARTMENT[0])
            .then(async(response) => {
                console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
                console.log(error);
                status = false;
            });
        curError = "Ошибка получения задач пользователя";
        if(TaskData) await getTasksData(Store.userData.ID)
            .then(async(response) => {
                console.log(JSON.stringify(response.data));
               
                
            })
            .catch((error) => {
                console.log(error);
                status = false;
            }); 
        curError = "Ошибка получения статусов документов";
        if (docsStatuses) await getUpdStatusesData()
            .then(async(response) => {
                console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
                console.log(error);
                status = false;                                        
            })
        if (docsStatuses) await getItineraryStatusesData()
            .then((response) => 
            {
                console.log(JSON.stringify(response.data));
            }) 
            .catch((error) => {
                console.log(false,  error);
                status = false;
            })     
        
        return {status: status, curError:curError};
    }
    catch(error)
    {
        console.error;
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
    url = `https://bitrix24.martinural.ru/rest/597/9sxsabntxlt7pa2k/crm.item.list`;
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
    const url = 'https://bitrix24.martinural.ru/rest/597/9sxsabntxlt7pa2k/crm.item.list'
    let req = axios.post(url,body);
    return req;
}


export async function  updUpdStatus(IDUpd:string,IDStatus:string, userID: string){
    const body = {
        "entityTypeId": "168",
        "id": IDUpd,
        "fields":{
            "stageId":IDStatus,
            "assignedById": userID
        }
    }
    console.log(body);
    const url = 'https://bitrix24.martinural.ru/rest/597/9sxsabntxlt7pa2k/crm.item.update'
    let req = await axios.post(url,body);
    return req;
}
export async function  updItineraryStatus(IDItinerary:string,IDStatus:string, userID: string){
    const body = {
        "entityTypeId": "133",
        "id": IDItinerary,
        "fields":{
            "stageId":IDStatus,
            "updatedBy": userID
        }
    }
    const url = 'https://bitrix24.martinural.ru/rest/597/9sxsabntxlt7pa2k/crm.item.update'
    let req = await axios.post(url,body);
    return req;
}



