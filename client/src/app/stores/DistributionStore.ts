import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { CannedReply } from '../models/cannedReply';
import { DistributionFormValues } from '../models/distribution';

export default class DistributionStore {
  distributionValues = new DistributionFormValues();
  cannedReplies: CannedReply[] = [];
  loadingCannedReplies: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  loadCannedReplies = async (departmentId: string) => {
    this.loadingCannedReplies = true;
    try {
      const loadedReplies = await agent.Departments.getCannedReplies(departmentId);
      runInAction(() => {
        this.cannedReplies = loadedReplies;
      });
    } catch (err) {
      console.error(err);
    } finally {
      runInAction(() => {
        this.loadingCannedReplies = false;
      });
    }
  };

  get cannedRepliesOptions() {
    return this.cannedReplies.map((reply, index) => ({
      key: index + reply.title,
      text: reply.title,
      value: reply.text,
    }));
  }
}
