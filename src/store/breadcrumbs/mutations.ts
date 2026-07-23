import { MutationTree } from 'vuex';

import {
  BreadcrumbsStateI,
  BreadcrumbI,
} from './state';

export const mutations: MutationTree<BreadcrumbsStateI> = {

  setBreadcrumbs(state: BreadcrumbsStateI, payload: BreadcrumbI[]): void {
    state.breadcrumbs = payload;
  },

};
