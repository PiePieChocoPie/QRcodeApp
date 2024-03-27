import { observable, action } from 'mobx';

class StatusesListStore {
    @observable statusData = null;
    @observable itineraryData = null;

    @action
    setStatusesListData(updData) {
        this.statusData = updData;
    }

    @action
    setItineraryListData(updData) {
        this.itineraryData = updData;
    }
}

const statusesListStore = new StatusesListStore();
export default statusesListStore;