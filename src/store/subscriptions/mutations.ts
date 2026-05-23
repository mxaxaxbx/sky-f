import { MutationTree } from 'vuex';

import {
  SubscriptionsStateI,
  PlanI,
} from './state';

export const mutations: MutationTree<SubscriptionsStateI> = {

  setPlan(state: SubscriptionsStateI, payload: PlanI) {
    state.plan = payload;
  },

};
