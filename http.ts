import axios, {AxiosResponse} from "axios";
import updStore from "./stores/updStore";
import authStore from "./stores/authStore";
import depStore from "./stores/depStore";
import taskStore from "./stores/taskStore";
import updListStore from "./stores/updListStore";
import statusesListStore from "./stores/statusesListStore";

export async function getAllStaticData(authToken:string){
    try{
        //получение пользователя
    let userConfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://192.168.91.115:22001/api/mobile/dataFromAuth/${authToken}`
    };
    const authData = await axios.request(userConfig);
    console.log(authData.data.result[0].NAME)
    if(authData.data.result ===undefined) return false;
    authStore.setUserData(authData.data.result);

        //получение подразделения
    let depconfig = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://bitrix24.martinural.ru/rest/578/extp02nu56oz6zhn/department.get.json?ID=${authStore.userData[0].UF_DEPARTMENT}`
    };
    const depData = await axios.request(depconfig);
    depStore.setDepData(depData.data.result);
    if(depData.data.result===undefined) return false;

        //получение задач
    const taskData = await axios.post(`http://192.168.91.115:22001/api/bitrix/task/tasks/${authStore.userData[0].ID}`);
    console.log(taskData.data.result.tasks[0])
    taskStore.setTaskData(taskData.data.result.tasks);
    if(depData.data.result===undefined) return false;

        //получение статусов упд
    const updStatusesData = await axios.post("https://bitrix24.martinural.ru/rest/597/9sxsabntxlt7pa2k/crm.status.entity.items?entityId=DYNAMIC_168_STAGE_9");
    statusesListStore.setStatusesListData(updStatusesData.data.result);
    if(updStatusesData.data.result===undefined) return false;

        //получение статусов маршрутных листов
    const itineraryStatusesData = await axios.post("https://bitrix24.martinural.ru/rest/597/9sxsabntxlt7pa2k/crm.status.entity.items?entityId=DYNAMIC_133_STAGE_10");
    statusesListStore.setItineraryListData(itineraryStatusesData.data.result);
    if(itineraryStatusesData.data.result ===undefined) return false;
    
    }
    catch(e){
        alert("Ошибка авторизации:"+ e);
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



