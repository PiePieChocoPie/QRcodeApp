import { observable, action } from 'mobx';

class AuthStore {
    @observable userData = null;
    @observable tokenData = null;
    @action
    setUserData(userData) {
        this.userData = userData;
    }
    @action
    setTokenData(tokenData){
        this.tokenData = tokenData;
    }
}

const authStore = new AuthStore();
export default authStore;