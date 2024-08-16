import { makeAutoObservable } from 'mobx';

class Store {
  userData: any = null;
  userStorageData: any = null;
  tokenData: any = null;
  depData: any = null;
  statusData: any = null;
  itineraryData: any = null;
  itineraryStatusesData: any = null;
  taskData: any = null;
  trafficData: any = null;
  updData: any = null;
  updStatusesData: any = null;
  userPhoto: any = null;
  statusWorkDay: any = null;
  storages: any = null;
  clients: any = null;
  guidClients: any = null;
  mainDate: any = null;
  extraDate: any = null;
  filterItems: any = null;
  attorneys: any = null;
  attorneyStatusesData: any = null;
  isWarehouse:boolean=false;
  docsList:any = null;

  constructor() {
    makeAutoObservable(this);
  }

  setProperty(key: string, value: any) {
    (this as any)[key] = value;
  }

  setUserData(userData: any) {
    this.setProperty('userData', userData);
  }

  setUserStorageData(userStorageData: any) {
    this.setProperty('userStorageData', userStorageData);
  }

  setClients(clients: any) {
    this.setProperty('clients', clients);
  }

  setUserStorage(userData: any) {
    this.setProperty('storages', userData);
  }

  setStatusWorkDay(statusWorkDay: any) {
    this.setProperty('statusWorkDay', statusWorkDay);
  }

  setUserPhoto(userData: any) {
    this.setProperty('userPhoto', userData);
  }

  setTokenData(tokenData: any) {
    this.setProperty('tokenData', tokenData);
  }

  setUpdData(updData: any) {
    this.setProperty('updData', updData);
  }

  setItineraryData(updData: any) {
    this.setProperty('itineraryData', updData);
  }

  setUpdStatusesData(updData: any) {
    this.setProperty('updStatusesData', updData);
  }

  setAttorneyStatusesData(attorneyData: any) {
    this.setProperty('attorneyStatusesData', attorneyData);
  }

  setItineraryStatusesData(updData: any) {
    this.setProperty('itineraryStatusesData', updData);
  }

  setTaskData(taskData: any) {
    this.setProperty('taskData', taskData);
  }

  setDepData(depData: any) {
    this.setProperty('depData', depData);
  }

  setTrafficData(trafficData: any) {
    this.setProperty('trafficData', trafficData);
  }

  setMainDate(mainDate: any) {
    this.setProperty('mainDate', mainDate);
  }

  setExtraDate(extraDate: any) {
    this.setProperty('extraDate', extraDate);
  }

  setFilterItems(filterItems: any) {
    this.setProperty('filterItems', filterItems);
  }

  setAttorneys(attorneys: any) {
    this.setProperty('attorneys', attorneys);
  }

  setIsWarehouse(isWarehouse:boolean){
    this.setProperty('isWarehouse', isWarehouse);
  }

  setDocsList(docsList:any){
    this.setProperty('docsList', docsList)
  }
}

const storeInstance = new Store();
export default storeInstance;
