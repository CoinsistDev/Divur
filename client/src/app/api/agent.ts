import axios, { AxiosError, AxiosResponse } from 'axios'
import { history } from '../..';
import { CannedReply } from '../models/cannedReply';
import { Department, DepartmentFormValues } from '../models/department';
import { DistributionFormValues } from '../models/distribution';
import { ScheduledTask } from '../models/scheduledTask';
import { Tag } from '../models/tag';
import { TwoFactor } from '../models/twoFactor';
import { User, UserFormValues } from '../models/user';
import { store } from '../stores/store';
import { toast } from 'react-toastify'
import Blacklist from '../models/blacklist';

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}
console.log(process.env.REACT_APP_API_URL);

axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? "http://13.69.58.163/api" : "https://divur.consist.co.il/api/";
console.log(process.env.NODE_ENV);

axios.interceptors.request.use(config => {
    // if (process.env.NODE_ENV === 'development') {
    //     const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im9yaXpAY29uc2lzdC5jby5pbCIsInVuaXF1ZV9uYW1lIjoib3JpekBjb25zaXN0LmNvLmlsIiwibmFtZWlkIjoiMWFkM2UzOTktOGQzMC00MTk3LTk0MDctYWVjMzFlMmY2MjJlIiwicm9sZSI6IkFkbWluIiwibmJmIjoxNjQ5NjcxNzc1LCJleHAiOjE2NDk2NzIzNzUsImlhdCI6MTY0OTY3MTc3NX0.QnMpnZXak34pB8RyHI4Ihgq2l_Klp2c0u0ofpMPakRbLXqDyKZXTfpRv-rjNVbK6kGWiGY7S93PgJEYQEj8FVQ";
    //     config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
})

axios.interceptors.response.use(async response => {
    // if(process.env.NODE_ENV === 'development')
    if (process.env.NODE_ENV === 'development') await sleep(1000);
    return response;

}, (error: AxiosError) => {
    const { data, status, config, headers } = error.response!;
    switch (status) {
        case 400:
            if (config.method === 'get' && data.errors.hasOwnProperty('id')) {
                history.push('/wa/not-found')
            }
            if (data.errors) {
                const modalStateErrors = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modalStateErrors.push(data.errors[key]);
                    }
                }
                throw modalStateErrors.flat();
            }
            if (data.message) {
                console.log(data.message);
                throw [data.message];
            }
            break;
        case 401:
            if (headers['www-authenticate']) {
                if (status === 401 && headers['www-authenticate'].startsWith('Bearer error="invalid_token"')) {
                    store.userStore.logout();
                    toast.error('החיבור פג, נא התחבר שוב')
                }
            }
            if (data.message) {
                throw [data.message];
            }
            break;

        case 403:
            history.push('/wa');
            break;
        case 404:
            if(!config.url?.includes("/findByPhone"))
            history.push('/wa/not-found');
            break;
        case 500:
            toast.error('חלה תקלה, נא נסו שנית מאוחר יותר')
            break;
    }
    return Promise.reject(error);
})

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}

const Departments = {
    create: (department: DepartmentFormValues) => requests.post('department', department),
    list: () => requests.get<Department[]>('department/UserDepartments'),
    listAll: () => requests.get<Department[]>('department'),
    details: (id: string) => requests.get<Department>(`department/${id}`),
    edit: (department: Department) => requests.put(`department`, department),
    getTags: (id: string) => requests.get<Tag[]>(`department/tags/${id}`),
    getCannedReplies: (id: string) => requests.get<CannedReply[]>(`department/cannedreplies/${id}`),
    addRemoveUser: (email: string, departmentId: string) => requests.post('department/adduser', { username: email, departmentId: departmentId }),
    removeUserDepartment : (email: string, departmentId: string) => requests.post('department/deleteuser', { username: email, departmentId: departmentId })
}

const AppUser = {
    currentUser: () => requests.get<User>('account'),
    getDepartments: () => requests.get<Department[]>('account/departments'),
    updateLastDepartment: (id: string) => requests.put(`account/updateLastDepartment/${id}`, {}),
    register: (loginData: UserFormValues, id: string) => requests.post(`account/register/${id}`, loginData),
    resetPassword: (token: string, email: string, password: string) => requests.post(`account/resetPassword`, {password, email, token}),
    login: (loginData: UserFormValues) => requests.post<User>('account/login', loginData),
    login2fa: (loginData: UserFormValues) => requests.post<TwoFactor>('account/login2fa', loginData),
    verify2fa: (twoFactor: TwoFactor) => requests.post<User>('account/verify', twoFactor),
    logout: () => requests.post('account/logout', {}),
    sendResetPasswordMail: (email: string) => requests.get(`account/sendResetPasswordMail/${email}`),
    refreshToken: () => requests.post<User>('account/refreshToken', {}),
    resendOTP: (email: string, requestId: string) => requests.post<TwoFactor>(`/account/resendOTP?email=${email}&requestId=${requestId}`, {}),
    toggleImplementor: (email: string) => requests.put(`/account/roles/implementor?userEmail=${email}`, {})
}

const Distribution = {
    send: (distribtuionData: DistributionFormValues) => {
        let formData = new FormData();
        formData.append('File', distribtuionData.file[0]);
        formData.append('Message', distribtuionData.message);
        formData.append('From', distribtuionData.from);
        formData.append('isInternational', distribtuionData.isInternational? 'true' : 'false');
        formData.append('Parameters', JSON.stringify(distribtuionData.parameters));
        if(distribtuionData.protocolType){
            formData.append('protocolType',distribtuionData.protocolType)
        }
        if (distribtuionData.isNonTicket)
            formData.append('isNonTicket', "false");
        else
            formData.append('isNonTicket', "true");

        if (distribtuionData.imageUrl)
            formData.append('imageUrl', distribtuionData.imageUrl);

        let formattedTags = [] as string[];
        let tagString = '';
        distribtuionData.selectedTags.forEach(tag => {
            formattedTags.push(tag.name)
            tagString += tag.name + ','
        })
        tagString.substring(0, tagString.length - 1)

        formData.append('tags', tagString.substring(0, tagString.length - 1));
        if (distribtuionData.isTimed)
            formData.append('ScheduleDate', distribtuionData.scheduleDate!.toISOString());

        const url = `distribution/${distribtuionData.departmentId}`;
            return axios.post<ScheduledTask>(url, formData, {
                headers: { 'Content-type': 'multipart/form-data' }
            });
    },
    cancelJob: (id: string) => requests.delete(`distribution/${id}`)
}
const Messages = {
    getStats: (id: string, startDate: string, endDate: string) => requests.get<Partial<Department>>(`/message/${id}?startDate=${startDate}&endDate=${endDate}`),
    sendReportToMail: (id: string, startDate: string, endDate: string) => requests.get<any>(`/message/import-to-excel/${id}?startDate=${startDate}&endDate=${endDate}`)
}
const BlackList = {
    list: (departmentId:string,page:number) => requests.get<Blacklist[]>(`/blacklist?departmentId=${departmentId}&page=${page}`),
    remove: (departmentId:string,id:number) => requests.delete(`/blacklist?departmentId=${departmentId}&id=${id}`),
    findByPhone:(departmentId:string,phoneNumber:string) => requests.get<Blacklist>(`/blacklist/findByPhone?departmentId=${departmentId}&phoneNumber=${phoneNumber}`),
    sendReportToMail: (id: string) => requests.get<any>(`/blacklist/import-to-excel/${id}`),
    import: (blacklistData: any) => {
        let formData = new FormData();
        formData.append('File', blacklistData.file[0]);
        const url = `blacklist/import-from-excel/${blacklistData.departmentId}`;
            return axios.post<any>(url, formData, {
                headers: { 'Content-type': 'multipart/form-data' }
            });
    },
}

const agent = {
    Departments,
    Distribution,
    AppUser,
    Messages,
    BlackList
}

export default agent;