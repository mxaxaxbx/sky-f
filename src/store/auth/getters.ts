import { GetterTree } from 'vuex';

import { decode } from '@/utils/custom-enc-dec';
import { snakeToCamel } from '@/utils';

import {
  AuthStateI,
  UserI,
  ProjectI,
  PermissionI,
} from './state';
import { RootStateI } from '../state';

export const getters: GetterTree<AuthStateI, RootStateI> = {
  isAuth: (state) => {
    const token = localStorage.getItem('token');
    return !!token;
  },
  user: (state) => {
    const encodedUser = localStorage.getItem('user');
    if (!encodedUser) return state.user;
    const { value } = decode(encodedUser);
    const user = typeof value === 'string' ? JSON.parse(value) : value;
    return snakeToCamel(user) as UserI;
  },
  projects: (state) => {
    const encodedProjects = localStorage.getItem('projects');
    if (!encodedProjects) return state.projects;
    const { value } = decode(encodedProjects);
    return typeof value === 'string' ? JSON.parse(value) : value;
  },
  project: (state) => {
    const encodedProject = localStorage.getItem('project');
    if (!encodedProject) return state.project;
    const { value } = decode(encodedProject);
    return typeof value === 'string' ? JSON.parse(value) : value;
  },
  permissions: (state) => {
    const encodedPermissions = localStorage.getItem('permissions');
    if (!encodedPermissions) return state.permissions;
    const { value } = decode(encodedPermissions);

    let permissions: PermissionI[] = [];
    if (typeof value === 'string') {
      const perms = JSON.parse(value);
      permissions = snakeToCamel(perms) as PermissionI[];
    } else {
      permissions = snakeToCamel(value) as PermissionI[];
    }

    return permissions as PermissionI[];
  },
};
