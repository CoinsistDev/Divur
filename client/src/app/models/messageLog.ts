export interface MessageLog
{
    id: number;
    date: Date;
    from: string;
    to: string;
    text: string;
    status: string;
    ticket:boolean;
    protocolType:string
}