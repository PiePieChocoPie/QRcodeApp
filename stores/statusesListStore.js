import { observable, action } from 'mobx';

class StatusesListStore {
    @observable statusData = null;

    @action
    setStatusesListData(updData) {
        this.statusData = updData;
    }
}

const statusesListStore = new StatusesListStore();
export default statusesListStore;