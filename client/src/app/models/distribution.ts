import { DistributionParameter } from "./distributionParameter";
import { Tag } from "./tag";

export interface Distribution {
    departmentId: string;
    file: File[];
    message: string;
    from: string;
    parameters: DistributionParameter[];
    isNonTicket: string;
    isInternational: boolean;
    tags: Tag[];
    isTimed:boolean;
    scheduleDate:Date | null;
    imageUrl?:string;
}
export class Distribution implements Distribution{
    constructor(init?: DistributionFormValues){
        Object.assign(this, init);
    }
}
export class DistributionFormValues{

    departmentId = "";
    file = [] as File[];
    message = "";
    from = "";
    parameters = [] as DistributionParameter[];
    isNonTicket = false;
    isInternational = false;
    tagsList = [] as Tag[];
    selectedTags =[]  as Tag[];
    isTimed = false;
    scheduleDate : Date | null = null;
    imageUrl?:string = "";
    protocolType = "WhatsApp"

    constructor(distributionData?: DistributionFormValues){
        if(distributionData){
            this.departmentId = distributionData.departmentId;
            this.file = distributionData.file;
            this.message = distributionData.message;
            this.from = distributionData.from;
            this.parameters = distributionData.parameters;
            this.isNonTicket = distributionData.isNonTicket;
            this.selectedTags = distributionData.selectedTags;
            this.tagsList = distributionData.tagsList;
            this.isTimed = distributionData.isTimed;
            this.isInternational = distributionData.isInternational;
            this.scheduleDate = distributionData.scheduleDate;
            this.imageUrl = distributionData.imageUrl
            this.protocolType = distributionData.protocolType;
        }
    }
}