import { ActionTree, ActionContext } from 'vuex';

import { storageClient } from '@/http-client';
import { snakeToCamel } from '@/utils';

import { RootStateI } from '../state';
import { PlanI, StorageI, SubscriptionsStateI } from './state';

const CACHE_TTL_MS = 20 * 24 * 60 * 60 * 1000;
const PLAN_CACHE_KEY = 'subscriptions:plan';
const STORAGE_CACHE_KEY = 'subscriptions:storage';

interface CacheEntry<T> {
  savedAt: number;
  value: T;
}

const removeCacheItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    // Ignore storage failures here as well.
  }
};

const readCache = <T>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key);

    if (!raw) return null;

    const parsed = JSON.parse(raw) as CacheEntry<T>;

    if (!parsed?.savedAt || Date.now() - parsed.savedAt > CACHE_TTL_MS) {
      removeCacheItem(key);
      return null;
    }

    return parsed.value ?? null;
  } catch (error) {
    removeCacheItem(key);
    return null;
  }
};

const writeCache = <T>(key: string, value: T): void => {
  try {
    const payload: CacheEntry<T> = {
      savedAt: Date.now(),
      value,
    };

    localStorage.setItem(key, JSON.stringify(payload));
  } catch (error) {
    // Ignore storage quota / private mode failures and keep the service path working.
  }
};

export const actions: ActionTree<SubscriptionsStateI, RootStateI> = {

  async getPlan(
    context: ActionContext<SubscriptionsStateI, RootStateI>,
  ): Promise<void> {
    const cachedPlan = readCache<PlanI>(PLAN_CACHE_KEY);

    if (cachedPlan) {
      context.commit('setPlan', cachedPlan);
      return;
    }

    const { data } = await storageClient.get('/api/subscriptions/plan');
    const plan = snakeToCamel(data);
    context.commit('setPlan', plan);
    writeCache(PLAN_CACHE_KEY, plan);
  },

  async getStorage(
    context: ActionContext<SubscriptionsStateI, RootStateI>,
  ): Promise<void> {
    const cachedStorage = readCache<StorageI>(STORAGE_CACHE_KEY);

    if (cachedStorage) {
      context.commit('setStorage', cachedStorage);
      return;
    }

    const { data } = await storageClient.get('/api/subscriptions/storage');
    const storage = snakeToCamel(data);
    context.commit('setStorage', storage);
    writeCache(STORAGE_CACHE_KEY, storage);
  },

};
