import axios from 'axios';
import { checkRecords } from 'src/func';
import Store from "src/stores/mobx";
import { getDepData } from './hierarchy';
import { getAttorneyStatusesData, getItineraryStatusesData, getTasksData, getUpdStatusesData } from './docs';
import { getUsersTrafficStatistics } from './timeManagement';

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
  console.log(response.data.WORK_POSITION);
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
        // console.log('attprneys = ',Store.attorneys)
        if (onAuthorize&&response.data.total > 0) 
        {
            const items = response.data.result.items;
            // console.log(items)
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
            // console.log('Итем - ', earliestItem, '\n Трафик - ', Store.trafficData);
            const result = checkRecords(earliestItem.ufCrm10ProxyDate, trafficData,  nextTrafficData);
            console.log( result ? 'несданные доверенности' : 'задолженности не обнаружены');
            return result;
            }
        }
    } catch (error) {
      console.log(error);
      return false;
    }
    return false;
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
  
      if (docsStatuses) {
        await getAttorneyStatusesData()
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
  
