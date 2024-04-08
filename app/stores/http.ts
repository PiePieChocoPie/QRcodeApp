import axios from "axios";
import Store from "./mobx";
import {decode} from "base-64";
import { Alert } from "react-native";
import { err } from "react-native-svg";
import {url} from '@env';

export async function dataByToken(authToken:string){
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://bitrix24.martinural.ru/mobileControllers/dataByToken.php/?token=${authToken}`,
        headers: { 
          'Authorization': 'Basic YWRtaW5Nb2RlOlp4YzEyMw==', 
        }
      };
      return await axios.request(config);
}

export async function depData(ID:string){
    let data = {    
        "ID": ID,
    };

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://bitrix24.martinural.ru/rest/578/j919bucygnb3tdf9/department.get.json',
        headers: { 

          'Content-Type': 'application/json'
        },
        data : data,
        withCredentials: false
      };
    return await axios.request(config)
}

export async function taskData(ID:string){
    let data = JSON.stringify({
        "filter": {
            "<REAL_STATUS": "5",
            "RESPONSIBLE_ID": ID
        }
        });
        
        let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://bitrix24.martinural.ru/rest/597/9sxsabntxlt7pa2k/tasks.task.list',
        headers: { 
            'Content-Type': 'application/json', 
            
        },
        data : data,
        withCredentials: false
        };
        
        return await axios.request(config)
}

export async function updStatusesData(){
    let data = JSON.stringify({
        "entityId": "DYNAMIC_168_STAGE_9",
        'Authorization': 'Basic YXJtOnp4YzEyMzQ1Ng==', 

        });
        
        let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://bitrix24.martinural.ru/rest/597/9sxsabntxlt7pa2k/crm.status.entity.items',
        headers: { 
            'Content-Type': 'application/json', 
        },
        data : data,
        withCredentials: false
        };
        
        return await axios.request(config)
}

export async function itineraryStatusesData(){
    let data = JSON.stringify({
        "entityId": "DYNAMIC_133_STAGE_10"
        });
        
        let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://bitrix24.martinural.ru/rest/597/9sxsabntxlt7pa2k/crm.status.entity.items',
        headers: { 
            'Content-Type': 'application/json', 
        },
        data : data,
        withCredentials: false
        };
        
        return await axios.request(config)
}

export async function getAllStaticData(authToken:string){
    try
    {
        let status = true,  curError = "Неверная авторизация";
        // //получение пользователя       
        await dataByToken(authToken)
            .then(async(response) => {
                Store.setUserData(response.data);
                console.log(JSON.stringify(Store.userData));
                })
            .catch((error) => {
                console.log(false,  error);
                status = false;
                });
        curError = "Ошибка получения подразделения";
        await depData(Store.userData.UF_DEPARTMENT[0])
        //    console.log(check)
            .then(async(response) => {
                console.log(JSON.stringify(response.data));
                Store.setDepData(response.data);                    
                })
            .catch((error) => {
                console.log(error);
                status = false;
                });
        curError = "Ошибка получения задач пользователя";
        await taskData(Store.userData.ID)
            .then(async(response) => {
                console.log(JSON.stringify(response.data));
                Store.setTaskData(response.data.result.tasks)
                
            })
            .catch((error) => {
                console.log(error);
                status = false;
            });
        curError = "Ошибка получения статусов документов";
        await updStatusesData()
            .then(async(response) => {
                console.log(JSON.stringify(response.data));
                Store.setUpdData(response.data.result);
            })
            .catch((error) => {
                console.log(error);
                status = false;
            });
        await itineraryStatusesData()
            .then((response) => {
                console.log(JSON.stringify(response.data));
                // Store.set
            })
            .catch((error) => {
                console.log(error);
                status = false;
            });
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



