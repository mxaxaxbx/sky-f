import { Module } from 'vuex';

import { RootStateI } from '../state';
import { state, SubscriptionsStateI } from './state';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';

const module: Module<SubscriptionsStateI, RootStateI> = {
  state,
  getters,
  mutations,
  actions,
  namespaced: true,
};

export default module;
