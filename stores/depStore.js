import { observable, action } from 'mobx';

class DepStore {
    @observable depData = null;

    @action
    setDepData(depData) {
        this.depData = depData;
    }
}

const depStore = new DepStore();
export default depStore;