import axios, {AxiosResponse} from "axios";
import authStore from "./authStoreDir";

export function bitrixAuthRequest(token: string): Promise<AxiosResponse>{
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://192.168.91.115:22001/api/auth/bitrix/${token}`
    };
    return axios.request(config);
}

export function bitrixUserRequest(token: string): Promise<AxiosResponse> {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://192.168.91.115:22001/api/auth/bitrixData/${token}`
    };
    return axios.request(config)
}

export function sendTo1cData(raw: string): Promise<any> {
    const data = (
    {
        ID:authStore.userData[0].ID,
        FULL_NAME:`${authStore.userData[0].LAST_NAME} ${authStore.userData[0].NAME} ${authStore.userData[0].SECOND_NAME}`,
        user:
        {
            text:raw,
            status:'3.Сдан'
        }
    });
    const url = 'http://192.168.91.174:3303/api/1c/setstatus';
    const headers = {
        'Content-Type': 'application/json'
    };

    return axios.post(url, data, { headers })
        .then(response => {
            console.log(response.data);
            return response.data;
        })
        .catch(error => {
            console.error(error);
            throw error;
        });
}

export function bitrixDepRequest(id: string): Promise<AxiosResponse> {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://bitrix24.martinural.ru/rest/578/extp02nu56oz6zhn/department.get.json?ID=${id}`
    };
    return axios.request(config)
}


