import { Module } from 'vuex';
import { state, EditorStateI } from './state';
import { mutations } from './mutations';
import { actions } from './actions';
import { RootStateI } from '../state';

const editorModule: Module<EditorStateI, RootStateI> = {
  namespaced: true,
  state,
  mutations,
  actions,
};

export default editorModule;
