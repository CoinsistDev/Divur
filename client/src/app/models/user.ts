
export interface User{
    email:string;
    displayName:string;
    phone:string;
    departments: userDepartment[];
    lastDepartmentVisited:string;
    token: string;
    roles: string[];
}

export interface UserFormValues{
    email:String;
    displayName?:string;
    userName?:string;
    password?:string;
    phone?:string;
}

export interface userDepartment{
    id:string;
    name:string;
}