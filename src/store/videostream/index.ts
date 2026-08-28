import { Module } from 'vuex';

import { RootStateI } from '../state';
import { state, VideoStreamStateI } from './state';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';

const module: Module<VideoStreamStateI, RootStateI> = {
  state,
  getters,
  mutations,
  actions,
  namespaced: true,
};

export default module;
