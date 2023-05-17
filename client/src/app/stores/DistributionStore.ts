import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { Tag } from '../models/tag';
import { CannedReply } from '../models/cannedReply';
import { DistributionFormValues } from '../models/distribution';

export default class DistributionStore {
    distributionValues: DistributionFormValues = new DistributionFormValues();
    tags: Tag[] = [];
    cannedReplies: CannedReply[] = [];
    loadingTags: boolean = false;
    loadingCannedReplies: boolean = false;


    constructor() {
        makeAutoObservable(this);
    }

    loadTags = async (departmentId: string) => {

        try {
            this.loadingTags = true;
            var loadedTags = await agent.Departments.getTags(departmentId);
            runInAction(() => {
                this.tags = loadedTags;
                this.loadingTags = false;
            })
            return loadedTags;

        }
        catch (err) {
            runInAction(() => {
                console.log(err);
                this.loadingTags = false;
            })
        }
    }

    loadCannedReplies = async (departmentId: string) => {
        try {
            this.loadingCannedReplies = true;
            var loadedReplies = await agent.Departments.getCannedReplies(departmentId);
            runInAction(() => {
                this.cannedReplies = loadedReplies;
                this.loadingCannedReplies = false;
            })
        }
        catch (err) {
            runInAction(() => {
                console.log(err);
                this.loadingCannedReplies = false;
            })
        }
    }
  
    get cannedRepliesOptions() {
        if (this.cannedReplies.length === 0) {
            return [];
        }
        var selectObject = [{}];
        selectObject.pop();
        var index = 0;
        this.cannedReplies.forEach(reply => {
            selectObject.push({ "key": index + reply.title, "text": reply.title, "value": reply.text })
            index++;
        })
       return selectObject;
    }
}