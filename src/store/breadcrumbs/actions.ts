import { ActionTree, ActionContext } from 'vuex';

import { storageClient } from '@/http-client';
import { snakeToCamel, camelToSnake } from '@/utils';

import { RootStateI } from '../state';
import { BreadcrumbsStateI } from './state';

export const actions: ActionTree<BreadcrumbsStateI, RootStateI> = {

  async getBreadcrumbs(
    context: ActionContext<BreadcrumbsStateI, RootStateI>,
    payload: string,
  ): Promise<void> {
    const { data } = await storageClient.get(`/api/storage/${payload}/breadcrumbs`);
    console.log('data->', data);
  },

};
