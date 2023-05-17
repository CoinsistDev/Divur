// import { ServerError } from "../models/serverError";
import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import blacklist from '../models/blacklist';
import { store } from './store';
export default class BlacklistStore {
    blacklist = [] as blacklist[];
    selectedNumber:blacklist|null = null;
    loading = false;
    page:number = 0;
    constructor() {
        makeAutoObservable(this);

    }

    loadBlacklist = async () =>{
        try{
            if(store.departmentStore.currentDepartment){

            this.loading = true;
            const list = await agent.BlackList.list(store.departmentStore.currentDepartment.id,this.page)
            runInAction(() =>{
                this.blacklist = [...this.blacklist,...list];
                this.loading = false;
                this.page++;
            })
        }
        }catch(err){
            console.log(err);
            runInAction(() =>{
                this.loading = false;
            })
        }
    }
    findByPhone = async (phoneNumber:string) =>{
        try{
            if(store.departmentStore.currentDepartment){

            this.loading = true;
            const phoneInList = this.blacklist.filter(b => b.phone === this.formatPhone(phoneNumber))
            if(phoneInList.length !== 0){
                this.selectedNumber = phoneInList[0];
                this.loading = false;
                return;
            }

            const phoneItem = await agent.BlackList.findByPhone(store.departmentStore.currentDepartment.id,phoneNumber)
            runInAction(() =>{
               this.selectedNumber = phoneItem;
               this.loading = false;
            })
        }
        }catch(err){
            console.log(err);
            runInAction(() =>{
                this.loading = false;
            })
        }
    }
    removeBlacklistPhone = async (id:number) =>{
        try{
            if(store.departmentStore.currentDepartment){
            this.loading = true;
            await agent.BlackList.remove(store.departmentStore.currentDepartment.id,id)
            runInAction(() =>{
                this.blacklist = this.blacklist.filter(x => x.id !== id);
                this.loading = false;
            })
        }
        }catch(err){
            console.log(err);
            runInAction(() =>{
                this.loading = false;
            })
        }
    }
    clearBlacklist = () =>{
        this.blacklist = [];
        this.page = 0;
    }
    clearSelectedPhone = () =>{
        this.selectedNumber = null;
    }

    formatPhone = (phone:string) => {
        phone = phone.split('-').join('');
        if(phone.startsWith('0')) phone = "972"+phone.substring(1);

        return phone;
    }

    sendreport = async () => {
        try {
            if(store.departmentStore.currentDepartment){
                this.loading = true;
                 await agent.BlackList.sendReportToMail(store.departmentStore.currentDepartment.id);
                runInAction(() => this.loading = false);
            }
        } catch (err) {
            console.log(err)
            runInAction(() => this.loading = false);
            throw err;
        }
    }
}
