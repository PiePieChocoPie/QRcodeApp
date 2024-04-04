import axios from "axios";
import Store from "./mobx";
import {decode} from "base-64";
import { Alert } from "react-native";
import { err } from "react-native-svg";
import {url} from '@env';

export async function getAllStaticData(authToken:string){
    // try
    // {
        // //получение пользователя
        // const decodedToken = decode(authToken);
        // console.log(decodedToken);
        // const trimAuth = decodedToken.trim();
        // const login = trimAuth.split(':')[0];
        // let config = {
        //     method: 'get',
        //     maxBodyLength: Infinity,
        //     url: `https://bitrix24.martinural.ru/documents1c/dataByLogin.php/?login=${login}`,
        //     headers: {
        //         'Authorization': `Basic ${authToken}`
        //     }
        // };
        console.log(url);
    //     await axios.request(config).then(async(userData) =>{
    //         // Alert.alert("ошибка", userData.data)
    //         console.log(userData.data.NAME, userData.data.LAST_NAME);
    //         const url =`https://bitrix24.martinural.ru/rest/578/extp02nu56oz6zhn/user.get.json?NAME=${userData.data.NAME}&LAST_NAME=${userData.data.LAST_NAME}`;
    //         console.log(url)

    //         await axios.post(url).then(async(authData)=>{
    //             console.log(authData)
    //             if(authData.data.result ===undefined) return false;
    //             Store.setUserData(authData.data.result);
    //             console.log(Store.userData[0].ID)

    //                 //получение подразделения
    //             let depConfig = {
    //                 method: 'get',
    //                 maxBodyLength: Infinity,
    //                 url: `https://bitrix24.martinural.ru/rest/578/extp02nu56oz6zhn/department.get.json?ID=${Store.userData[0].UF_DEPARTMENT}`
    //             };
    //             await axios.request(depConfig).then(async(depData) =>{
    //                 Store.setDepData(depData.data.result);
    //                 console.log(Store.depData[0].NAME)
    //                 if(depData.data.result===undefined) return false;
    //                 const bodyToTask ={
    //                     filter:
    //                         {
    //                             "<REAL_STATUS": "5",
    //                             "RESPONSIBLE_ID": Store.userData[0].ID
    //                         }
    //                 };
    //                     //получение задач
    //                 axios.post(`https://bitrix24.martinural.ru/rest/597/9sxsabntxlt7pa2k/tasks.task.list`, bodyToTask).then(async(taskData)=>{
    //                     console.log('таски ---- '+taskData.data.result.tasks[0].title)
    //                     Store.setTaskData(taskData.data.result.tasks);
    //                     console.log(taskData.data.result.tasks)
    //                     if(Store.taskData===undefined) return false;

    //                         //получение статусов упд
    //                     await axios.post("https://bitrix24.martinural.ru/rest/597/9sxsabntxlt7pa2k/crm.status.entity.items?entityId=DYNAMIC_168_STAGE_9").then(async(updStatusesData)=>{
    //                         Store.setStatusesListData(updStatusesData.data.result);
    //                         if(updStatusesData.data.result===undefined) return false;

    //                             //получение статусов маршрутных листов
    //                         const itineraryStatusesData = await axios.post("https://bitrix24.martinural.ru/rest/597/9sxsabntxlt7pa2k/crm.status.entity.items?entityId=DYNAMIC_133_STAGE_10").then(async(itineraryStatusesData)=>{
    //                             Store.setItineraryListData(itineraryStatusesData.data.result);
    //                             if(itineraryStatusesData.data.result ===undefined) return false;
    //                         })
    //                         .catch((err)=>'ошибка получения статусов маршрутных листов: '+ err);
    //                     })
    //                     .catch((err)=>'ошибка получения статусов упд: '+err);
    //                 })
    //                 .catch((err)=>'ошибка получения тасков: '+err);
    //             })
    //             .catch((err)=>'ошибка получения подразделений: '+err);
    //         })
    //         .catch((err)=>console.log('ошибка авторизации 2: '+err));
    //     })
    //     .catch((err)=>console.log('ошибка авторизации: '+err));
    // }
    // catch(error)
    // {
    //     console.error;
    //     return false;
    //     // Alert.alert("ошибка", error);
    // }
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



