import axios from "axios";
import Store from "src/stores/mobx";

export async function openDay(ID: string): Promise<string> {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${process.env.baseUrl}/rest/597/9sxsabntxlt7pa2k/timeman.open?USER_ID=${ID}`,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: false
    };
  
    const response = await axios.request(config);
    return JSON.stringify(response.data);
  }
  
  export async function statusDay(ID: string): Promise<any> {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${process.env.baseUrl}/rest/597/9sxsabntxlt7pa2k/timeman.status?USER_ID=${ID}`,
      headers: { 'Content-Type': 'application/json' },
      withCredentials: false
    };
  
    const response = await axios.request(config);
    Store.setStatusWorkDay(response.data.result.STATUS);
    return response;
  }
  
  export async function getReports(): Promise<any> {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${process.env.baseUrl}/MartinAPI/API.php`,
      withCredentials: false
    };
  
    const response = await axios.request(config);
    return response;
  }
  
  
  
  export async function getUsersTrafficStatistics(Month: number, Year: number): Promise<any> {
    try {
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${process.env.baseUrl}${process.env.DanilaToken}timeman.timecontrol.reports.get?MONTH=${Month}&YEAR=${Year}&USER_ID=${Store.userData.ID}`,
        headers: { 'Content-Type': 'application/json' },
        withCredentials: false
      };
  
      const response = await axios.request(config);
      Store.setTrafficData(response.data.result.report.days);
      return response.data.result.report.days;
    } catch {
      return false;
    }
  }
  