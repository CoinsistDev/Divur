export interface ScheduledTask{
 id:string;
 taskId:string;
 createdAt:Date
 scheduledFor:Date
 status:number;
 distributor: string
 distributionTitle: string
}