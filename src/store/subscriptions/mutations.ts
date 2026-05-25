import { MutationTree } from 'vuex';

import {
  SubscriptionsStateI,
  PlanI,
  StorageI,
} from './state';

export const mutations: MutationTree<SubscriptionsStateI> = {

  setPlan(state: SubscriptionsStateI, payload: PlanI) {
    state.plan = payload;
  },

  setStorage(state: SubscriptionsStateI, payload: StorageI) {
    state.storage = payload;
  },

};
