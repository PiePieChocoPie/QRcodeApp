import { observable, action } from 'mobx';

class UpdStore {
    @observable updData = null;

    @action
    setUpdData(updData) {
        this.updData = updData;
    }
}

const updStore = new UpdStore();
export default updStore;