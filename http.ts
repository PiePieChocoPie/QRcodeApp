import axios, {AxiosResponse} from "axios";
import updStore from "./stores/updStore";

export function bitrixAuthRequest(token: string): Promise<AxiosResponse>{
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://192.168.91.115:22001/api/mobile/baseAuth/${token}`
    };
    return axios.request(config);
}

export function bitrixUserRequest(token: string): Promise<AxiosResponse> {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://192.168.91.115:22001/api/mobile/dataFromAuth/${token}`
    };
    return axios.request(config)
}

export function bitrixDepRequest(id: string): Promise<AxiosResponse> {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://bitrix24.martinural.ru/rest/578/extp02nu56oz6zhn/department.get.json?ID=${id}`
    };
    return axios.request(config);
}

export function  getUserCurTasks(ID:string){
    // let options = {
    //     method: 'POST',
    //     maxBodyLength: Infinity,
    //     url: `http://192.168.91.115:22001/api/bitrix/task/tasks/${ID}`
    // };
    const url = 'http://192.168.91.115:22001/api/bitrix/task/tasks/'+ID
    let req = axios.post(url);
    return req;
}

export async function getDataAboutDocs(raw:string){
    const url = `http://192.168.91.115:22001/api/mobile/getupd/${raw}`;
    return axios.get(url);
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

export function getUpdStatusesList(){
    return axios.post("https://bitrix24.martinural.ru/rest/597/9sxsabntxlt7pa2k/crm.status.entity.items?entityId=DYNAMIC_168_STAGE_9");
}

export function  updUpdStatus(IDUpd:string,IDStatus:string, userID: string){
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
    let req = axios.post(url,body);
    return req;
}




