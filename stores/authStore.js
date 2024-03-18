import { observable, action } from 'mobx';

class AuthStore {
    @observable userData = null;

    @action
    setUserData(userData) {
        this.userData = userData;
    }
}

const authStore = new AuthStore();
export default authStore;