import { observable, action} from 'mobx';

class store {
    @observable userData = null;
    @observable tokenData = null;
    @observable depData = null;
    @observable statusData = null;
    @observable itineraryData = null;
    @observable itineraryStatusesData = null;
    @observable taskData = null;
    @observable trafficData = null;
    @observable updData = null;
    @observable updStatusesData = null;
    @observable userPhoto = null;
    @observable statusWorkDay = null;
    @observable storages = null;


    @action
    setUserData(userData) {
        this.userData = userData;
    } 
    @action
    setUserStorage(userData) {
        this.storages = userData;
    } 
    @action
    setStatusWorkDay(statusWorkDay) {
        this.statusWorkDay = statusWorkDay;
    } 
    @action
    setUserPhoto(userData) {
        this.userPhoto = userData;
    }
    @action
    setTokenData(tokenData){
        this.tokenData = tokenData;
    }
    @action
    setUpdData(updData) {
        this.updData = updData;
    }
    @action
    setItineraryData(updData) {
        this.itineraryData = updData;
    }
    @action
    setUpdStatusesData(updData) {
        this.updStatusesData = updData;
    }
    @action
    setItineraryStatusesData(updData) {
        this.itineraryStatusesData = updData;
    }
    @action
    setTaskData(taskData) {
        this.taskData = taskData;
    }
    @action
    setDepData(depData) {
        this.depData = depData;
    }
    @action
    setTrafficData(trafficData){
        this.trafficData = trafficData;

    }
}

const Store = new store();

export default Store;