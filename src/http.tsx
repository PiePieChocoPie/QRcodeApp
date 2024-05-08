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
export async function getReports(){
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${process.env.baseUrl}/MartinAPI/API.php`,
        withCredentials: false
    };
        
    const response = await axios.request(config)    
    console.log(JSON.stringify(response.data, null, 2));
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
        return true;
    }
    catch{
        return false;
    }
}

export async function getTestExcel(){
    try{
        let data = '<Settings xmlns="http://v8.1c.ru/8.1/data-composition-system/settings" xmlns:dcscor="http://v8.1c.ru/8.1/data-composition-system/core" xmlns:style="http://v8.1c.ru/8.1/data/ui/style" xmlns:sys="http://v8.1c.ru/8.1/data/ui/fonts/system" xmlns:v8="http://v8.1c.ru/8.1/data/core" xmlns:v8ui="http://v8.1c.ru/8.1/data/ui" xmlns:web="http://v8.1c.ru/8.1/data/ui/colors/web" xmlns:win="http://v8.1c.ru/8.1/data/ui/colors/windows" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="Settings">\n    <selection>\n        <item xsi:type="SelectedItemField">\n            <field>ДолгКлиента</field>\n        </item>\n        <viewMode>Normal</viewMode>\n        <userSettingID>59284c59-42cb-41d2-8d3a-790668722582</userSettingID>\n    </selection>\n    <filter>\n        <item xsi:type="FilterItemComparison">\n            <use>false</use>\n            <left xsi:type="dcscor:Field">Организация</left>\n            <comparisonType>InList</comparisonType>\n            <right xsi:type="v8:ValueListType">\n                <v8:valueType/>\n                <v8:lastId xsi:type="xs:decimal">-1</v8:lastId>\n            </right>\n            <userSettingID>e2bc1b68-3719-4abf-a5ac-762b47347810</userSettingID>\n        </item>\n        <item xsi:type="FilterItemComparison">\n            <left xsi:type="dcscor:Field">Партнер</left>\n            <comparisonType>InList</comparisonType>\n            <right xmlns:d4p1="http://v8.1c.ru/8.1/data/enterprise/current-config" xsi:type="d4p1:CatalogRef.Партнеры">0620f122-79de-11ed-8108-ac1f6b727abf</right>\n            <userSettingID>108fd64c-3cb0-4d71-ae27-557a52b7e76a</userSettingID>\n        </item>\n        <item xsi:type="FilterItemComparison">\n            <use>false</use>\n            <left xsi:type="dcscor:Field">Партнер.ОсновнойМенеджер</left>\n            <comparisonType>InList</comparisonType>\n            <right xsi:type="v8:ValueListType">\n                <v8:valueType/>\n                <v8:lastId xsi:type="xs:decimal">-1</v8:lastId>\n            </right>\n            <userSettingID>4e2d0610-b6e1-43a0-bfcb-1419f63646ce</userSettingID>\n        </item>\n        <item xsi:type="FilterItemComparison">\n            <use>false</use>\n            <left xsi:type="dcscor:Field">СегментПартнеров</left>\n            <comparisonType>Equal</comparisonType>\n        </item>\n        <item xsi:type="FilterItemComparison">\n            <use>false</use>\n            <left xsi:type="dcscor:Field">Контрагент</left>\n            <comparisonType>Equal</comparisonType>\n        </item>\n        <viewMode>Normal</viewMode>\n        <userSettingID>b18cb75b-c008-48ec-95fd-712d33b0d157</userSettingID>\n    </filter>\n    <dataParameters>\n        <dcscor:item xsi:type="SettingsParameterValue">\n            <dcscor:parameter>ДатаОтчета</dcscor:parameter>\n            <dcscor:value xsi:type="xs:dateTime">2024-02-07T00:00:00</dcscor:value>\n            <userSettingID>aa45c291-bbef-4305-80f3-93434cd6f5e0</userSettingID>\n        </dcscor:item>\n        <dcscor:item xsi:type="SettingsParameterValue">\n            <dcscor:parameter>ВариантКлассификацииЗадолженности</dcscor:parameter>\n            <dcscor:value xmlns:d4p1="http://v8.1c.ru/8.1/data/enterprise/current-config" xsi:type="d4p1:CatalogRef.ВариантыКлассификацииЗадолженности">b5eafd26-8c27-11e5-812f-e03f4980f4ff</dcscor:value>\n            <userSettingID>659de66b-295c-4e58-b82d-749c08696420</userSettingID>\n        </dcscor:item>\n        <dcscor:item xsi:type="SettingsParameterValue">\n            <dcscor:parameter>Календарь</dcscor:parameter>\n            <dcscor:value xmlns:d4p1="http://v8.1c.ru/8.1/data/enterprise/current-config" xsi:type="d4p1:CatalogRef.ПроизводственныеКалендари">6cead12b-8c27-11e5-812f-e03f4980f4ff</dcscor:value>\n            <viewMode>Normal</viewMode>\n            <userSettingID>2ed06fcc-d22f-4f75-acf1-31c7cbdee20e</userSettingID>\n        </dcscor:item>\n        <dcscor:item xsi:type="SettingsParameterValue">\n            <dcscor:use>false</dcscor:use>\n            <dcscor:parameter>ИспользуетсяОтборПоСегментуПартнеров</dcscor:parameter>\n            <dcscor:value xsi:type="xs:boolean">true</dcscor:value>\n        </dcscor:item>\n        <dcscor:item xsi:type="SettingsParameterValue">\n            <dcscor:parameter>ДанныеОтчета</dcscor:parameter>\n            <dcscor:value xsi:type="xs:decimal">2</dcscor:value>\n            <viewMode>Normal</viewMode>\n            <userSettingID>ef96d5e2-2856-431b-8895-bd3a8299e74f</userSettingID>\n        </dcscor:item>\n        <dcscor:item xsi:type="SettingsParameterValue">\n            <dcscor:parameter>ДатаОстатков</dcscor:parameter>\n            <dcscor:value xmlns:d4p1="http://v8.1c.ru/8.1/data/enterprise" xsi:type="d4p1:Bound">\n                <d4p1:value xsi:type="xs:dateTime">2024-03-14T23:59:59</d4p1:value>\n                <d4p1:kind>0</d4p1:kind>\n            </dcscor:value>\n        </dcscor:item>\n    </dataParameters>\n    <order>\n        <item xsi:type="OrderItemField">\n            <field>ДолгКлиентаПросрочено</field>\n            <orderType>Desc</orderType>\n        </item>\n        <item xsi:type="OrderItemField">\n            <field>ДолгКлиента</field>\n            <orderType>Desc</orderType>\n        </item>\n        <item xsi:type="OrderItemField">\n            <field>НашДолг</field>\n            <orderType>Asc</orderType>\n        </item>\n        <viewMode>Normal</viewMode>\n        <userSettingID>140c881b-75aa-493f-879a-74d98f043a80</userSettingID>\n    </order>\n    <conditionalAppearance>\n        <item>\n            <selection>\n                <item>\n                    <field>ДолгКлиентаПросрочено</field>\n                </item>\n            </selection>\n            <filter>\n                <item xsi:type="FilterItemComparison">\n                    <left xsi:type="dcscor:Field">ДолгКлиентаПросрочено</left>\n                    <comparisonType>Greater</comparisonType>\n                    <right xsi:type="xs:decimal">0</right>\n                    <presentation xsi:type="xs:string">Просроченный долг</presentation>\n                </item>\n            </filter>\n            <appearance>\n                <dcscor:item xsi:type="SettingsParameterValue">\n                    <dcscor:parameter>ЦветТекста</dcscor:parameter>\n                    <dcscor:value xsi:type="v8ui:Color">style:ПросроченныеДанныеЦвет</dcscor:value>\n                </dcscor:item>\n            </appearance>\n            <presentation xsi:type="xs:string">Просроченный долг</presentation>\n        </item>\n    </conditionalAppearance>\n    <outputParameters>\n        <dcscor:item xsi:type="SettingsParameterValue">\n            <dcscor:parameter>МакетОформления</dcscor:parameter>\n            <dcscor:value xsi:type="xs:string">ОформлениеОтчетовБежевый</dcscor:value>\n        </dcscor:item>\n        <dcscor:item xsi:type="SettingsParameterValue">\n            <dcscor:parameter>ВыводитьЗаголовок</dcscor:parameter>\n            <dcscor:value xsi:type="DataCompositionTextOutputType">DontOutput</dcscor:value>\n            <viewMode>Inaccessible</viewMode>\n        </dcscor:item>\n        <dcscor:item xsi:type="SettingsParameterValue">\n            <dcscor:use>false</dcscor:use>\n            <dcscor:parameter>Заголовок</dcscor:parameter>\n            <dcscor:value xsi:type="xs:string">Задолженность клиентов по срокам</dcscor:value>\n            <viewMode>Normal</viewMode>\n        </dcscor:item>\n        <dcscor:item xsi:type="SettingsParameterValue">\n            <dcscor:parameter>ВыводитьПараметрыДанных</dcscor:parameter>\n            <dcscor:value xsi:type="DataCompositionTextOutputType">DontOutput</dcscor:value>\n            <viewMode>Normal</viewMode>\n        </dcscor:item>\n        <dcscor:item xsi:type="SettingsParameterValue">\n            <dcscor:parameter>ВыводитьОтбор</dcscor:parameter>\n            <dcscor:value xsi:type="DataCompositionTextOutputType">DontOutput</dcscor:value>\n            <viewMode>Inaccessible</viewMode>\n        </dcscor:item>\n    </outputParameters>\n    <item xsi:type="StructureItemGroup">\n        <use>false</use>\n        <name>ГруппировкаВалюта</name>\n        <groupItems>\n            <item xsi:type="GroupItemField">\n                <field>Валюта</field>\n                <groupType>Items</groupType>\n                <periodAdditionType>None</periodAdditionType>\n                <periodAdditionBegin xsi:type="xs:dateTime">0001-01-01T00:00:00</periodAdditionBegin>\n                <periodAdditionEnd xsi:type="xs:dateTime">0001-01-01T00:00:00</periodAdditionEnd>\n            </item>\n        </groupItems>\n        <order>\n            <item xsi:type="OrderItemAuto"/>\n        </order>\n        <selection>\n            <item xsi:type="SelectedItemAuto">\n                <use>false</use>\n            </item>\n            <item xsi:type="SelectedItemField">\n                <field>Валюта</field>\n            </item>\n        </selection>\n        <item xsi:type="StructureItemChart">\n            <use>false</use>\n            <point>\n                <groupItems>\n                    <item xsi:type="GroupItemField">\n                        <field>НаименованиеИнтервала</field>\n                        <groupType>Items</groupType>\n                        <periodAdditionType>None</periodAdditionType>\n                        <periodAdditionBegin xsi:type="xs:dateTime">0001-01-01T00:00:00</periodAdditionBegin>\n                        <periodAdditionEnd xsi:type="xs:dateTime">0001-01-01T00:00:00</periodAdditionEnd>\n                    </item>\n                </groupItems>\n                <order>\n                    <item xsi:type="OrderItemField">\n                        <field>НижняяГраницаИнтервала</field>\n                        <orderType>Asc</orderType>\n                    </item>\n                </order>\n                <selection>\n                    <item xsi:type="SelectedItemAuto"/>\n                </selection>\n            </point>\n            <selection>\n                <item xsi:type="SelectedItemField">\n                    <field>ДолгКлиента</field>\n                </item>\n            </selection>\n            <outputParameters>\n                <dcscor:item xsi:type="SettingsParameterValue">\n                    <dcscor:parameter>ТипДиаграммы</dcscor:parameter>\n                    <dcscor:value xsi:type="v8ui:ChartType">Pie</dcscor:value>\n                    <dcscor:item xsi:type="SettingsParameterValue">\n                        <dcscor:parameter>ТипДиаграммы.ВидПодписей</dcscor:parameter>\n                        <dcscor:value xsi:type="v8ui:ChartLabelType">Series</dcscor:value>\n                    </dcscor:item>\n                    <dcscor:item xsi:type="SettingsParameterValue">\n                        <dcscor:parameter>ТипДиаграммы.РасположениеЛегенды</dcscor:parameter>\n                        <dcscor:value xsi:type="DataCompositionChartLegendPlacement">None</dcscor:value>\n                    </dcscor:item>\n                </dcscor:item>\n            </outputParameters>\n            <viewMode>Normal</viewMode>\n            <userSettingID>702e23c3-22d4-4e87-badb-50d85a43849a</userSettingID>\n            <userSettingPresentation xsi:type="xs:string">Показывать диаграмму структуры долга по интервалам</userSettingPresentation>\n        </item>\n        <item xsi:type="StructureItemGroup">\n            <use>false</use>\n            <groupItems>\n                <item xsi:type="GroupItemField">\n                    <field>НаименованиеИнтервала</field>\n                    <groupType>Items</groupType>\n                    <periodAdditionType>None</periodAdditionType>\n                    <periodAdditionBegin xsi:type="xs:dateTime">0001-01-01T00:00:00</periodAdditionBegin>\n                    <periodAdditionEnd xsi:type="xs:dateTime">0001-01-01T00:00:00</periodAdditionEnd>\n                </item>\n            </groupItems>\n            <filter>\n                <item xsi:type="FilterItemComparison">\n                    <left xsi:type="dcscor:Field">ДолгКлиента</left>\n                    <comparisonType>NotEqual</comparisonType>\n                </item>\n            </filter>\n            <order>\n                <item xsi:type="OrderItemField">\n                    <field>НижняяГраницаИнтервала</field>\n                    <orderType>Asc</orderType>\n                </item>\n            </order>\n            <selection>\n                <item xsi:type="SelectedItemField">\n                    <field>СистемныеПоля.НомерПоПорядку</field>\n                </item>\n                <item xsi:type="SelectedItemField">\n                    <field>НаименованиеИнтервала</field>\n                </item>\n                <item xsi:type="SelectedItemField">\n                    <field>ДолгКлиента</field>\n                </item>\n                <item xsi:type="SelectedItemField">\n                    <field>ДоляДолга</field>\n                    <title>%</title>\n                </item>\n            </selection>\n            <conditionalAppearance>\n                <item>\n                    <selection>\n                        <item>\n                            <field>ДолгКлиента.ПроцентВГруппе</field>\n                        </item>\n                    </selection>\n                    <filter/>\n                    <appearance>\n                        <dcscor:item xsi:type="SettingsParameterValue">\n                            <dcscor:parameter>Формат</dcscor:parameter>\n                            <dcscor:value xsi:type="xs:string">ЧЦ=10</dcscor:value>\n                        </dcscor:item>\n                    </appearance>\n                </item>\n            </conditionalAppearance>\n            <outputParameters>\n                <dcscor:item xsi:type="SettingsParameterValue">\n                    <dcscor:parameter>ВертикальноеРасположениеОбщихИтогов</dcscor:parameter>\n                    <dcscor:value xsi:type="dcscor:DataCompositionTotalPlacement">End</dcscor:value>\n                </dcscor:item>\n                <dcscor:item xsi:type="SettingsParameterValue">\n                    <dcscor:parameter>ВыводитьОтбор</dcscor:parameter>\n                    <dcscor:value xsi:type="DataCompositionTextOutputType">DontOutput</dcscor:value>\n                </dcscor:item>\n            </outputParameters>\n        </item>\n    </item>\n    <item xsi:type="StructureItemTable">\n        <column>\n            <groupItems>\n                <item xsi:type="GroupItemField">\n                    <field>ГруппировкаВсего</field>\n                    <groupType>Items</groupType>\n                    <periodAdditionType>None</periodAdditionType>\n                    <periodAdditionBegin xsi:type="xs:dateTime">0001-01-01T00:00:00</periodAdditionBegin>\n                    <periodAdditionEnd xsi:type="xs:dateTime">0001-01-01T00:00:00</periodAdditionEnd>\n                </item>\n            </groupItems>\n            <order>\n                <item xsi:type="OrderItemAuto"/>\n            </order>\n            <selection>\n                <item xsi:type="SelectedItemAuto"/>\n                <item xsi:type="SelectedItemFolder">\n                    <title>Долг клиента</title>\n                    <item xsi:type="SelectedItemField">\n                        <field>ДолгКлиента</field>\n                        <title>Всего</title>\n                    </item>\n                    <item xsi:type="SelectedItemField">\n                        <field>ДоляДолга</field>\n                    </item>\n                    <item xsi:type="SelectedItemField">\n                        <field>ДолгКлиентаПросрочено</field>\n                        <title>Просрочено</title>\n                    </item>\n                    <item xsi:type="SelectedItemField">\n                        <field>ДоляПросроченнойЗадолженности</field>\n                        <title>%</title>\n                    </item>\n                    <item xsi:type="SelectedItemField">\n                        <field>КоличествоДней</field>\n                        <title>Дней</title>\n                    </item>\n                    <placement>Horizontally</placement>\n                </item>\n                <item xsi:type="SelectedItemField">\n                    <field>НашДолг</field>\n                </item>\n                <item xsi:type="SelectedItemField">\n                    <field>КОтгрузке</field>\n                </item>\n            </selection>\n            <outputParameters>\n                <dcscor:item xsi:type="SettingsParameterValue">\n                    <dcscor:parameter>РасположениеОбщихИтогов</dcscor:parameter>\n                    <dcscor:value xsi:type="dcscor:DataCompositionTotalPlacement">None</dcscor:value>\n                </dcscor:item>\n            </outputParameters>\n        </column>\n        <column>\n            <groupItems>\n                <item xsi:type="GroupItemField">\n                    <field>НаименованиеИнтервала</field>\n                    <groupType>Items</groupType>\n                    <periodAdditionType>None</periodAdditionType>\n                    <periodAdditionBegin xsi:type="xs:dateTime">0001-01-01T00:00:00</periodAdditionBegin>\n                    <periodAdditionEnd xsi:type="xs:dateTime">0001-01-01T00:00:00</periodAdditionEnd>\n                </item>\n            </groupItems>\n            <filter>\n                <item xsi:type="FilterItemComparison">\n                    <left xsi:type="dcscor:Field">ДолгКлиента</left>\n                    <comparisonType>NotEqual</comparisonType>\n                </item>\n            </filter>\n            <order>\n                <item xsi:type="OrderItemField">\n                    <field>НижняяГраницаИнтервала</field>\n                    <orderType>Asc</orderType>\n                </item>\n            </order>\n            <selection>\n                <item xsi:type="SelectedItemAuto"/>\n            </selection>\n            <outputParameters>\n                <dcscor:item xsi:type="SettingsParameterValue">\n                    <dcscor:parameter>РасположениеОбщихИтогов</dcscor:parameter>\n                    <dcscor:value xsi:type="dcscor:DataCompositionTotalPlacement">None</dcscor:value>\n                </dcscor:item>\n            </outputParameters>\n        </column>\n        <row>\n            <groupItems>\n                <item xsi:type="GroupItemField">\n                    <field>Партнер.ОсновнойМенеджер.Подразделение</field>\n                    <groupType>Items</groupType>\n                    <periodAdditionType>None</periodAdditionType>\n                    <periodAdditionBegin xsi:type="xs:dateTime">0001-01-01T00:00:00</periodAdditionBegin>\n                    <periodAdditionEnd xsi:type="xs:dateTime">0001-01-01T00:00:00</periodAdditionEnd>\n                </item>\n            </groupItems>\n            <order>\n                <item xsi:type="OrderItemAuto"/>\n            </order>\n            <selection>\n                <item xsi:type="SelectedItemAuto"/>\n            </selection>\n            <item>\n                <groupItems>\n                    <item xsi:type="GroupItemField">\n                        <field>Партнер.ОсновнойМенеджер</field>\n                        <groupType>Items</groupType>\n                        <periodAdditionType>None</periodAdditionType>\n                        <periodAdditionBegin xsi:type="xs:dateTime">0001-01-01T00:00:00</periodAdditionBegin>\n                        <periodAdditionEnd xsi:type="xs:dateTime">0001-01-01T00:00:00</periodAdditionEnd>\n                    </item>\n                </groupItems>\n                <order>\n                    <item xsi:type="OrderItemAuto"/>\n                </order>\n                <selection>\n                    <item xsi:type="SelectedItemAuto"/>\n                </selection>\n                <item>\n                    <groupItems>\n                        <item xsi:type="GroupItemField">\n                            <field>Партнер</field>\n                            <groupType>Items</groupType>\n                            <periodAdditionType>None</periodAdditionType>\n                            <periodAdditionBegin xsi:type="xs:dateTime">0001-01-01T00:00:00</periodAdditionBegin>\n                            <periodAdditionEnd xsi:type="xs:dateTime">0001-01-01T00:00:00</periodAdditionEnd>\n                        </item>\n                    </groupItems>\n                    <order>\n                        <item xsi:type="OrderItemAuto"/>\n                    </order>\n                    <selection>\n                        <item xsi:type="SelectedItemField">\n                            <field>СистемныеПоля.НомерПоПорядкуВГруппировке</field>\n                            <title>№ п/п</title>\n                        </item>\n                        <item xsi:type="SelectedItemAuto"/>\n                    </selection>\n                    <outputParameters>\n                        <dcscor:item xsi:type="SettingsParameterValue">\n                            <dcscor:parameter>ВыводитьОтбор</dcscor:parameter>\n                            <dcscor:value xsi:type="DataCompositionTextOutputType">DontOutput</dcscor:value>\n                        </dcscor:item>\n                    </outputParameters>\n                    <item>\n                        <groupItems>\n                            <item xsi:type="GroupItemField">\n                                <field>ЗаказКлиента</field>\n                                <groupType>Items</groupType>\n                                <periodAdditionType>None</periodAdditionType>\n                                <periodAdditionBegin xsi:type="xs:dateTime">0001-01-01T00:00:00</periodAdditionBegin>\n                                <periodAdditionEnd xsi:type="xs:dateTime">0001-01-01T00:00:00</periodAdditionEnd>\n                            </item>\n                        </groupItems>\n                        <order>\n                            <item xsi:type="OrderItemAuto"/>\n                        </order>\n                        <selection>\n                            <item xsi:type="SelectedItemField">\n                                <field>СистемныеПоля.НомерПоПорядкуВГруппировке</field>\n                            </item>\n                            <item xsi:type="SelectedItemAuto"/>\n                        </selection>\n                        <viewMode>Normal</viewMode>\n                        <userSettingID>e2f3a3c2-065e-4702-8c71-9079ae2ce702</userSettingID>\n                    </item>\n                </item>\n            </item>\n        </row>\n    </item>\n    <additionalProperties>\n        <v8:Property name="СтандартныеСвойстваПредопределенныхПараметровВывода">\n            <v8:Value xsi:type="v8:Array">\n                <v8:Value xsi:type="v8:Structure">\n                    <v8:Property name="Идентификатор">\n                        <v8:Value xsi:type="xs:string">TITLE</v8:Value>\n                    </v8:Property>\n                    <v8:Property name="Использование">\n                        <v8:Value xsi:type="xs:boolean">true</v8:Value>\n                    </v8:Property>\n                    <v8:Property name="Значение">\n                        <v8:Value xsi:type="xs:string">Задолженность клиентов по срокам</v8:Value>\n                    </v8:Property>\n                </v8:Value>\n                <v8:Value xsi:type="v8:Structure">\n                    <v8:Property name="Идентификатор">\n                        <v8:Value xsi:type="xs:string">TITLEOUTPUT</v8:Value>\n                    </v8:Property>\n                    <v8:Property name="Использование">\n                        <v8:Value xsi:type="xs:boolean">true</v8:Value>\n                    </v8:Property>\n                    <v8:Property name="Значение">\n                        <v8:Value xsi:type="DataCompositionTextOutputType">Auto</v8:Value>\n                    </v8:Property>\n                </v8:Value>\n                <v8:Value xsi:type="v8:Structure">\n                    <v8:Property name="Идентификатор">\n                        <v8:Value xsi:type="xs:string">DATAPARAMETERSOUTPUT</v8:Value>\n                    </v8:Property>\n                    <v8:Property name="Использование">\n                        <v8:Value xsi:type="xs:boolean">true</v8:Value>\n                    </v8:Property>\n                    <v8:Property name="Значение">\n                        <v8:Value xsi:type="DataCompositionTextOutputType">Auto</v8:Value>\n                    </v8:Property>\n                </v8:Value>\n                <v8:Value xsi:type="v8:Structure">\n                    <v8:Property name="Идентификатор">\n                        <v8:Value xsi:type="xs:string">FILTEROUTPUT</v8:Value>\n                    </v8:Property>\n                    <v8:Property name="Использование">\n                        <v8:Value xsi:type="xs:boolean">true</v8:Value>\n                    </v8:Property>\n                    <v8:Property name="Значение">\n                        <v8:Value xsi:type="DataCompositionTextOutputType">Auto</v8:Value>\n                    </v8:Property>\n                </v8:Value>\n            </v8:Value>\n        </v8:Property>\n        <v8:Property name="ПараметрыПодбора">\n            <v8:Value xsi:type="v8:Map">\n                <v8:pair>\n                    <v8:Key xmlns:d6p1="http://v8.1c.ru/8.1/data/enterprise/current-config" xsi:type="v8:Type">d6p1:CatalogRef.Пользователи</v8:Key>\n                    <v8:Value xsi:type="xs:string">Справочник.Пользователи.ФормаВыбора</v8:Value>\n                </v8:pair>\n                <v8:pair>\n                    <v8:Key xmlns:d6p1="http://v8.1c.ru/8.1/data/enterprise/current-config" xsi:type="v8:Type">d6p1:CatalogRef.Партнеры</v8:Key>\n                    <v8:Value xsi:type="xs:string">Справочник.Партнеры.ФормаВыбора</v8:Value>\n                </v8:pair>\n                <v8:pair>\n                    <v8:Key xmlns:d6p1="http://v8.1c.ru/8.1/data/enterprise/current-config" xsi:type="v8:Type">d6p1:CatalogRef.Организации</v8:Key>\n                    <v8:Value xsi:type="xs:string">Справочник.Организации.ФормаВыбора</v8:Value>\n                </v8:pair>\n                <v8:pair>\n                    <v8:Key xmlns:d6p1="http://v8.1c.ru/8.1/data/enterprise/current-config" xsi:type="v8:Type">d6p1:CatalogRef.ВариантыКлассификацииЗадолженности</v8:Key>\n                    <v8:Value xsi:type="xs:string">Справочник.ВариантыКлассификацииЗадолженности.ФормаВыбора</v8:Value>\n                </v8:pair>\n            </v8:Value>\n        </v8:Property>\n        <v8:Property name="РасширенноеОписаниеТипов">\n            <v8:Value xsi:type="v8:Map">\n                <v8:pair>\n                    <v8:Key xsi:type="xs:decimal">7</v8:Key>\n                    <v8:Value xsi:type="v8:Structure">\n                        <v8:Property name="СодержитТипТип">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипДата">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипБулево">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипСтрока">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипЧисло">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипПериод">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипУИД">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипХранилище">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитОбъектныеТипы">\n                            <v8:Value xsi:type="xs:boolean">true</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="ОграниченнойДлины">\n                            <v8:Value xsi:type="xs:boolean">true</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="КоличествоТипов">\n                            <v8:Value xsi:type="xs:decimal">1</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="КоличествоПримитивныхТипов">\n                            <v8:Value xsi:type="xs:decimal">0</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="ОбъектныеТипы">\n                            <v8:Value xsi:type="v8:Array">\n                                <v8:Value xmlns:d9p1="http://v8.1c.ru/8.1/data/enterprise/current-config" xsi:type="v8:Type">d9p1:CatalogRef.Пользователи</v8:Value>\n                            </v8:Value>\n                        </v8:Property>\n                        <v8:Property name="ОписаниеТиповИсходное">\n                            <v8:Value xsi:type="v8:TypeDescription">\n                                <v8:Type xmlns:d9p1="http://v8.1c.ru/8.1/data/enterprise/current-config">d9p1:CatalogRef.Пользователи</v8:Type>\n                            </v8:Value>\n                        </v8:Property>\n                        <v8:Property name="ОписаниеТиповДляФормы">\n                            <v8:Value xsi:type="v8:TypeDescription">\n                                <v8:Type xmlns:d9p1="http://v8.1c.ru/8.1/data/enterprise/current-config">d9p1:CatalogRef.Пользователи</v8:Type>\n                            </v8:Value>\n                        </v8:Property>\n                    </v8:Value>\n                </v8:pair>\n                <v8:pair>\n                    <v8:Key xsi:type="xs:decimal">6</v8:Key>\n                    <v8:Value xsi:type="v8:Structure">\n                        <v8:Property name="СодержитТипТип">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипДата">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипБулево">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипСтрока">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипЧисло">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипПериод">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипУИД">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипХранилище">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитОбъектныеТипы">\n                            <v8:Value xsi:type="xs:boolean">true</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="ОграниченнойДлины">\n                            <v8:Value xsi:type="xs:boolean">true</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="КоличествоТипов">\n                            <v8:Value xsi:type="xs:decimal">1</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="КоличествоПримитивныхТипов">\n                            <v8:Value xsi:type="xs:decimal">0</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="ОбъектныеТипы">\n                            <v8:Value xsi:type="v8:Array">\n                                <v8:Value xmlns:d9p1="http://v8.1c.ru/8.1/data/enterprise/current-config" xsi:type="v8:Type">d9p1:CatalogRef.Партнеры</v8:Value>\n                            </v8:Value>\n                        </v8:Property>\n                        <v8:Property name="ОписаниеТиповИсходное">\n                            <v8:Value xsi:type="v8:TypeDescription">\n                                <v8:Type xmlns:d9p1="http://v8.1c.ru/8.1/data/enterprise/current-config">d9p1:CatalogRef.Партнеры</v8:Type>\n                            </v8:Value>\n                        </v8:Property>\n                        <v8:Property name="ОписаниеТиповДляФормы">\n                            <v8:Value xsi:type="v8:TypeDescription">\n                                <v8:Type xmlns:d9p1="http://v8.1c.ru/8.1/data/enterprise/current-config">d9p1:CatalogRef.Партнеры</v8:Type>\n                            </v8:Value>\n                        </v8:Property>\n                    </v8:Value>\n                </v8:pair>\n                <v8:pair>\n                    <v8:Key xsi:type="xs:decimal">1</v8:Key>\n                    <v8:Value xsi:type="v8:Structure">\n                        <v8:Property name="СодержитТипТип">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипДата">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипБулево">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипСтрока">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипЧисло">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипПериод">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипУИД">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипХранилище">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитОбъектныеТипы">\n                            <v8:Value xsi:type="xs:boolean">true</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="ОграниченнойДлины">\n                            <v8:Value xsi:type="xs:boolean">true</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="КоличествоТипов">\n                            <v8:Value xsi:type="xs:decimal">1</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="КоличествоПримитивныхТипов">\n                            <v8:Value xsi:type="xs:decimal">0</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="ОбъектныеТипы">\n                            <v8:Value xsi:type="v8:Array">\n                                <v8:Value xmlns:d9p1="http://v8.1c.ru/8.1/data/enterprise/current-config" xsi:type="v8:Type">d9p1:CatalogRef.ВариантыКлассификацииЗадолженности</v8:Value>\n                            </v8:Value>\n                        </v8:Property>\n                        <v8:Property name="ОписаниеТиповИсходное">\n                            <v8:Value xsi:type="v8:TypeDescription">\n                                <v8:Type xmlns:d9p1="http://v8.1c.ru/8.1/data/enterprise/current-config">d9p1:CatalogRef.ВариантыКлассификацииЗадолженности</v8:Type>\n                            </v8:Value>\n                        </v8:Property>\n                        <v8:Property name="ОписаниеТиповДляФормы">\n                            <v8:Value xsi:type="v8:TypeDescription">\n                                <v8:Type xmlns:d9p1="http://v8.1c.ru/8.1/data/enterprise/current-config">d9p1:CatalogRef.ВариантыКлассификацииЗадолженности</v8:Type>\n                            </v8:Value>\n                        </v8:Property>\n                    </v8:Value>\n                </v8:pair>\n                <v8:pair>\n                    <v8:Key xsi:type="xs:decimal">5</v8:Key>\n                    <v8:Value xsi:type="v8:Structure">\n                        <v8:Property name="СодержитТипТип">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипДата">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипБулево">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипСтрока">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипЧисло">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипПериод">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипУИД">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипХранилище">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитОбъектныеТипы">\n                            <v8:Value xsi:type="xs:boolean">true</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="ОграниченнойДлины">\n                            <v8:Value xsi:type="xs:boolean">true</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="КоличествоТипов">\n                            <v8:Value xsi:type="xs:decimal">1</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="КоличествоПримитивныхТипов">\n                            <v8:Value xsi:type="xs:decimal">0</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="ОбъектныеТипы">\n                            <v8:Value xsi:type="v8:Array">\n                                <v8:Value xmlns:d9p1="http://v8.1c.ru/8.1/data/enterprise/current-config" xsi:type="v8:Type">d9p1:CatalogRef.Организации</v8:Value>\n                            </v8:Value>\n                        </v8:Property>\n                        <v8:Property name="ОписаниеТиповИсходное">\n                            <v8:Value xsi:type="v8:TypeDescription">\n                                <v8:Type xmlns:d9p1="http://v8.1c.ru/8.1/data/enterprise/current-config">d9p1:CatalogRef.Организации</v8:Type>\n                            </v8:Value>\n                        </v8:Property>\n                        <v8:Property name="ОписаниеТиповДляФормы">\n                            <v8:Value xsi:type="v8:TypeDescription">\n                                <v8:Type xmlns:d9p1="http://v8.1c.ru/8.1/data/enterprise/current-config">d9p1:CatalogRef.Организации</v8:Type>\n                            </v8:Value>\n                        </v8:Property>\n                    </v8:Value>\n                </v8:pair>\n                <v8:pair>\n                    <v8:Key xsi:type="xs:decimal">0</v8:Key>\n                    <v8:Value xsi:type="v8:Structure">\n                        <v8:Property name="СодержитТипТип">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипДата">\n                            <v8:Value xsi:type="xs:boolean">true</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипБулево">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипСтрока">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипЧисло">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипПериод">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипУИД">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитТипХранилище">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="СодержитОбъектныеТипы">\n                            <v8:Value xsi:type="xs:boolean">false</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="ОграниченнойДлины">\n                            <v8:Value xsi:type="xs:boolean">true</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="КоличествоТипов">\n                            <v8:Value xsi:type="xs:decimal">1</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="КоличествоПримитивныхТипов">\n                            <v8:Value xsi:type="xs:decimal">1</v8:Value>\n                        </v8:Property>\n                        <v8:Property name="ОбъектныеТипы">\n                            <v8:Value xsi:type="v8:Array"/>\n                        </v8:Property>\n                        <v8:Property name="ОписаниеТиповИсходное">\n                            <v8:Value xsi:type="v8:TypeDescription">\n                                <v8:Type>xs:dateTime</v8:Type>\n                                <v8:DateQualifiers>\n                                    <v8:DateFractions>DateTime</v8:DateFractions>\n                                </v8:DateQualifiers>\n                            </v8:Value>\n                        </v8:Property>\n                        <v8:Property name="ОписаниеТиповДляФормы">\n                            <v8:Value xsi:type="v8:TypeDescription">\n                                <v8:Type>xs:dateTime</v8:Type>\n                                <v8:DateQualifiers>\n                                    <v8:DateFractions>DateTime</v8:DateFractions>\n                                </v8:DateQualifiers>\n                            </v8:Value>\n                        </v8:Property>\n                    </v8:Value>\n                </v8:pair>\n            </v8:Value>\n        </v8:Property>\n        <v8:Property name="ПорядокЭлементовНастроек">\n            <v8:Value xsi:type="v8:Map">\n                <v8:pair>\n                    <v8:Key xsi:type="xs:string">4e2d0610-b6e1-43a0-bfcb-1419f63646ce</v8:Key>\n                    <v8:Value xsi:type="xs:decimal">8</v8:Value>\n                </v8:pair>\n                <v8:pair>\n                    <v8:Key xsi:type="xs:string">03e2416b-cbb0-491c-8658-4e83e4a6f569</v8:Key>\n                    <v8:Value xsi:type="xs:decimal">5</v8:Value>\n                </v8:pair>\n                <v8:pair>\n                    <v8:Key xsi:type="xs:string">2ed06fcc-d22f-4f75-acf1-31c7cbdee20e</v8:Key>\n                    <v8:Value xsi:type="xs:decimal">6</v8:Value>\n                </v8:pair>\n                <v8:pair>\n                    <v8:Key xsi:type="xs:string">108fd64c-3cb0-4d71-ae27-557a52b7e76a</v8:Key>\n                    <v8:Value xsi:type="xs:decimal">4</v8:Value>\n                </v8:pair>\n                <v8:pair>\n                    <v8:Key xsi:type="xs:string">e2bc1b68-3719-4abf-a5ac-762b47347810</v8:Key>\n                    <v8:Value xsi:type="xs:decimal">3</v8:Value>\n                </v8:pair>\n                <v8:pair>\n                    <v8:Key xsi:type="xs:string">659de66b-295c-4e58-b82d-749c08696420</v8:Key>\n                    <v8:Value xsi:type="xs:decimal">2</v8:Value>\n                </v8:pair>\n                <v8:pair>\n                    <v8:Key xsi:type="xs:string">ef96d5e2-2856-431b-8895-bd3a8299e74f</v8:Key>\n                    <v8:Value xsi:type="xs:decimal">7</v8:Value>\n                </v8:pair>\n                <v8:pair>\n                    <v8:Key xsi:type="xs:string">aa45c291-bbef-4305-80f3-93434cd6f5e0</v8:Key>\n                    <v8:Value xsi:type="xs:decimal">1</v8:Value>\n                </v8:pair>\n            </v8:Value>\n        </v8:Property>\n        <v8:Property name="ИмяОтчета">\n            <v8:Value xsi:type="xs:string">ДебиторскаяЗадолженность</v8:Value>\n        </v8:Property>\n        <v8:Property name="КлючВарианта">\n            <v8:Value xsi:type="xs:string">24a19db6-6468-4af2-9301-adb87a680f3f</v8:Value>\n        </v8:Property>\n        <v8:Property name="ВариантНаименование">\n            <v8:Value xsi:type="xs:string">Задолженность клиентов по срокам (2)</v8:Value>\n        </v8:Property>\n        <v8:Property name="КлючПредопределенногоВарианта">\n            <v8:Value xsi:type="xs:string">ДебиторскаяЗадолженность</v8:Value>\n        </v8:Property>\n        <v8:Property name="КонтекстВарианта">\n            <v8:Value xsi:type="xs:string"/>\n        </v8:Property>\n        <v8:Property name="ФормаПараметрыОтбор">\n            <v8:Value xsi:type="v8:Structure"/>\n        </v8:Property>\n    </additionalProperties>\n</Settings>';

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://192.168.91.89/kamartin/ru_RU/hs/ot/skd2',
            headers :{
                'content-Type':'application/xml',
                'Authorization': `Basic ${Store.tokenData}`
            },
            withCredentials: false,
            body:data
        }
        await axios.request(config)
        .then((res)=>
        {
            Store.setExcelBinData(res)
            console.log(res)
            return true;
        }
        )
        .catch((err)=>{
            console.log(err)
            return false;
        });
    }
    catch{
        console.log("нихуя")
        return false;
    }
}