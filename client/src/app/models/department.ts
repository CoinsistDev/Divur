import { MessageLog } from "./messageLog";
import { User } from "./user";
import { PhoneNumber } from "./phoneNumber";
import { ScheduledTask } from "./scheduledTask";

export interface Department {
    id: string;
    name: string;
    remainingMessages: number;
    remainingSMSMessages:number;
    subDomain: string;
    apiKey: string;
    apiSecret: string;
    userName: string;
    messageLogs: MessageLog[];
    users: User[];
    phoneNumbers: PhoneNumber[];
    scheduledDistributionTasks: ScheduledTask[];
    totalMessageSent: number;
    totalNonTicketSent: number;
    totalNonTicketMessageDelivered: number;
    totalTicketMessageDelivered: number;
    totalNonTicketMessageRead: number;
    totalNonTicketMessageFailed: number;
    totalTicketMessageFailed: number;
}

export class Department implements Department {
    constructor(init?: Department) {
        Object.assign(this, init);
    }
}
export class DepartmentFormValues {

    id = "";
    name = "";
    remainingMessages = 0;
    remainingSMSMessages = 0;
    apiKey = "";
    apiSecret = "";
    userName = "";
    subDomain = 'app'
    phoneNumbers: PhoneNumber[] = [];

    constructor(departmentData?: DepartmentFormValues) {
        if (departmentData) {
            this.id = departmentData.id;
            this.name = departmentData.name;
            this.remainingMessages = departmentData.remainingMessages;
            this.subDomain = departmentData.subDomain;
            this.remainingSMSMessages = departmentData.remainingSMSMessages;
            this.apiKey = departmentData.apiKey;
            this.apiSecret = departmentData.apiSecret;
            this.userName = departmentData.userName;
            this.phoneNumbers = departmentData.phoneNumbers;
        }
    }
}