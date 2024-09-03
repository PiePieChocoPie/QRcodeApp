import axios from "axios";
import Store from "src/stores/mobx"

export async function getDepData(ids: string[]): Promise<any> {
  let results = [];

  for (let ID of ids) {
    let data = { "ID": ID };

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${process.env.baseUrl}${process.env.token}department.get.json`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data,
      withCredentials: false
    };

    const response = await axios.request(config);
    let depData = response.data.result[0];
    Store.setDepData(depData);
    results.push(depData);
  }

  let isWarehouse = results.some(depData => depData.ID === '23' || depData.PARENT === '23');
  Store.setIsWarehouse(isWarehouse);

  return results;
}

  
  export async function getHierarchy(): Promise<any> {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://bitrix24.martinural.ru/MartinAPI/Hieralcy.php?param=${Store.userData.WORK_POSITION}`,
      headers: { 'Authorization': 'Basic arm:Zxc123' },
      withCredentials: false
    };
  
    const response = await axios.request(config);
    return response.data;
  }

  export async function getPhoneNumbersOfColleagues(find?:string):Promise<any> {
    let Body;  
    if(find&&find!=''){
      Body = { "FILTER":
        {
            "FIND": find,
            ">PERSONAL_MOBILE": "",
            "ACTIVE":true
        }}
    }else{
        Body = { "FILTER":
        {
            "UF_DEPARTMENT": Store.userData.UF_DEPARTMENT,
            ">PERSONAL_MOBILE": "",
            "ACTIVE":true
        }}
      }
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.baseUrl}${process.env.token}user.search`,
        withCredentials: false,
        data: Body
      }
      let sortedData = [];
      const response = await axios.request(config);
      sortedData = response.data.result.sort(function(c1,c2){
        if (c1.LAST_NAME < c2.LAST_NAME) return -1;
        if (c1.LAST_NAME > c2.LAST_NAME) return 1;
        return 0;
      });
      for(let i=0;i<sortedData.length;i++)
      Store.setColleaguesData(sortedData);    
  }
  