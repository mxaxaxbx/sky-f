import { ActionTree, ActionContext } from 'vuex';

import { storageClient } from '@/http-client';
import { snakeToCamel, camelToSnake } from '@/utils';

import { RootStateI } from '../state';
import { SubscriptionsStateI } from './state';

export const actions: ActionTree<SubscriptionsStateI, RootStateI> = {

  async getPlan(
    context: ActionContext<SubscriptionsStateI, RootStateI>,
  ): Promise<void> {
    const { data } = await storageClient.get('/api/subscriptions/plan');
    context.commit('setPlan', snakeToCamel(data));
  },

  async getStorage(
    context: ActionContext<SubscriptionsStateI, RootStateI>,
  ): Promise<void> {
    const { data } = await storageClient.get('/api/subscriptions/storage');
    context.commit('setStorage', snakeToCamel(data));
  },

};
