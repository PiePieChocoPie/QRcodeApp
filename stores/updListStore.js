import { observable, action } from 'mobx';

class UpdListStore {
    @observable updData = null;

    @action
    setUpdListData(updData) {
        this.updData = updData;
    }
}

const updListStore = new UpdListStore();
export default updListStore;