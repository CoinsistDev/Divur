import { Department, DepartmentFormValues } from '../models/department';
import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { ScheduledTask } from '../models/scheduledTask';
import { User } from '../models/user'
import {v4 as uuid} from 'uuid';
export default class departmentStore {
    departmentRegistry = new Map<string, Department>();
    currentDepartment: Department | undefined = undefined;
    loading: boolean = false;
    initialLoading: boolean = true;
    loadingAll: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    createDepartment = async (department: DepartmentFormValues) => {
        try {
            const guidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
            this.loading = true;
            if(!guidRegex.test(department.apiKey)){
                department.id = uuid();
            }
            
            await agent.Departments.create(department);
            runInAction(() => {
                let newDepartment = {...department} as Department;
                this.departmentRegistry.set(department.id,newDepartment);
                this.loading = false;
            })
        }
        catch (err) {
            runInAction(() => {
                console.log(err);
                this.loading = false;
            })
            throw err;

        }
    }
    loadCurrentDepartment = async (id: string) => {
        if (this.currentDepartment && id === this.currentDepartment.id) return this.currentDepartment;
        try {
            this.initialLoading = true;
            var department = await agent.Departments.details(id);
            runInAction(() => {
                department.scheduledDistributionTasks.forEach(task => {

                    task.createdAt = new Date(task.createdAt+'z');
                    task.scheduledFor = new Date(task.scheduledFor+'z');

                })
                this.currentDepartment = department;
                this.initialLoading = false;
            })
            console.log('loadCurrentDepartment return' + department);
            console.log(department);
            
            
            return department;
        }
        catch (err) {
            runInAction(() => {
                console.log(err);
                this.initialLoading = false;
            })

        }
    }
    listAllDepartments = async () => {
        this.loadingAll = true;
        try {
            var departments = await agent.Departments.listAll();
            runInAction(() => {
                departments.forEach(department => {
                    this.departmentRegistry.set(department.id, department);
                })
                            this.loadingAll = false;

            })
            return departments;

        } catch (err) {
            runInAction(() => this.loadingAll = false
            )
            console.log(err);
        }
    }
    editDepartment = async (department: Department) => {
        this.loading = true;
        try {
            await agent.Departments.edit(department);
            runInAction(() => {
                this.departmentRegistry.set(department.id, department);
                this.loading = false;
            })
            return department;

        } catch (err) {
            runInAction(() => this.loading = false
            )
            console.log(err);
        }
    }
    addDistributionTask = (scheduledTask: ScheduledTask) => {
        this.currentDepartment!.scheduledDistributionTasks = [...this.currentDepartment!.scheduledDistributionTasks, scheduledTask];

    }
    cancelDistributionTask = async (jobId: string) => {

        try {
            this.loading = true;
            await agent.Distribution.cancelJob(jobId);
            runInAction(() => {
                if (this.currentDepartment !== undefined) {

                    this.currentDepartment.scheduledDistributionTasks.forEach(task => {
                        if (task.taskId === jobId)
                            task.status = 3;
                    })
                }
                this.loading = false;

            })


        } catch (err) {
            console.log(err);
            runInAction(() => this.loading = false)
            this.loading = false;
        }
    }
    setDepartment = (department:Department) =>{
        this.departmentRegistry.set(department.id,department);
    }

    removeUser = async (email: string, departmentId: string) => {
        try {
            this.loading = true;
            await agent.Departments.removeUserDepartment(email, departmentId);

            runInAction(() => {
                let newDepartment = this.departmentRegistry.get(departmentId)
                if (newDepartment) {
                    var user = newDepartment!.users.filter(u => u.email === email);
                    if (user.length === 0) {
                        let newUser = {
                            email: email,
                        } as User;
                        newDepartment.users.push(newUser)
                    }
                    else {
                        newDepartment.users = newDepartment!.users.filter(u => u.email !== email);
                    }
                    this.departmentRegistry.set(departmentId, newDepartment)

                }
                this.loading = false;
                console.log('try')
            })
            return this.departmentRegistry.get(departmentId);


        } catch (err) {
            console.log(err)
            runInAction(() => this.loading = false);
            throw err;

        }
    }

    updateUser = async (email: string, departmentId: string) => {
        try {
            this.loading = true;
            await agent.Departments.addRemoveUser(email, departmentId);

            runInAction(() => {
                let newDepartment = this.departmentRegistry.get(departmentId)
                if (newDepartment) {
                    var user = newDepartment!.users.filter(u => u.email === email);
                    if (user.length === 0) {
                        let newUser = {
                            email: email,
                        } as User;
                        newDepartment.users.push(newUser)
                    }
                    else {
                        newDepartment.users = newDepartment!.users.filter(u => u.email !== email);
                    }
                    this.departmentRegistry.set(departmentId, newDepartment)

                }
                this.loading = false;
                console.log('try')
            })
            return this.departmentRegistry.get(departmentId);


        } catch (err) {
            console.log(err)
            runInAction(() => this.loading = false);
            throw err;

        }
    }

    getMessageStats = async (id:string,startDate:string,endDate:string) => {
        try {
            this.loading = true;
            const result = await agent.Messages.getStats(id,startDate,endDate);
            runInAction(() => {
                if(this.currentDepartment)
                this.currentDepartment!.totalNonTicketMessageDelivered = result.totalNonTicketMessageDelivered!;
                this.currentDepartment!.totalMessageSent = result.totalMessageSent!;
                this.currentDepartment!.totalNonTicketMessageFailed = result.totalNonTicketMessageFailed!;
                this.currentDepartment!.totalNonTicketMessageRead = result.totalNonTicketMessageRead!;
                this.currentDepartment!.totalTicketMessageFailed = result.totalTicketMessageFailed!;
                this.currentDepartment!.totalTicketMessageDelivered = result.totalTicketMessageDelivered!;
                this.currentDepartment!.totalNonTicketSent = result.totalNonTicketSent!;
                this.loading = false;
            })
        } catch (err) {
            console.log(err)
            runInAction(() => this.loading = false);
            throw err;
        }
    }

    sendreport = async (id:string,startDate:string,endDate:string) => {
        try {
            this.loading = true;
             await agent.Messages.sendReportToMail(id,startDate,endDate);
            runInAction(() => this.loading = false);
        } catch (err) {
            console.log(err)
            runInAction(() => this.loading = false);
            throw err;
        }
    }

}