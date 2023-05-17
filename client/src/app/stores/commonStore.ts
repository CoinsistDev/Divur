import {makeAutoObservable} from 'mobx';
export default class CommonStore{

    appLoaded = false;
    constructor(){
        makeAutoObservable(this);
        
    }

    setAppLoaded = () => {
        this.appLoaded = true;
    }
}