import { observable, action } from 'mobx';

class store {
    @observable userData = null;
    @observable tokenData = null;
    @observable depData = null;
    @observable statusData = null;
    @observable itineraryData = null;
    @observable itineraryStatusesData = null;
    @observable taskData = null;
    @observable updData = null;
    @observable updStatusesData = null;


    @action
    setUserData(userData) {
        this.userData = userData;
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
        this.updData = updData;
    }
    @action
    setUpdStatusesData(updData) {
        this.updData = updData;
    }
    @action
    setItineraryStatusesData(updData) {
        this.updData = updData;
    }
    @action
    setTaskData(taskData) {
        this.taskData = taskData;
    }
    @action
    setDepData(depData) {
        this.depData = depData;
    }
}

const Store = new store();

export default Store;