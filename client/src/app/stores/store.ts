import DepartmentStore from "./DepartmentStore";
import DistrubitionStore from "./DistributionStore";
import CommonStore from "./commonStore";
import UserStore from "./UserStore";
import BlacklistStore from "./blacklistStore";
import {createContext, useContext} from "react";


interface Store{
    departmentStore: DepartmentStore;
    distrubitionStore: DistrubitionStore;
    userStore: UserStore;
    commonStore: CommonStore;
    blacklistStore:BlacklistStore
}

export const store: Store = {
    departmentStore: new DepartmentStore(),
    distrubitionStore: new DistrubitionStore(),
    userStore: new UserStore(),
    commonStore: new CommonStore(),
    blacklistStore: new BlacklistStore()
}

export const StoreContext = createContext(store);

export function useStore(){
    return useContext(StoreContext);
}