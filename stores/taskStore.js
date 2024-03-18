import { observable, action } from 'mobx';

class TaskStore {
    @observable taskData = null;

    @action
    setTaskData(taskData) {
        this.taskData = taskData;
    }
}

const taskStore = new TaskStore();
export default taskStore;