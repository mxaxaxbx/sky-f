export interface PlanI {
  billingCycle: string;
  created: number;
  currency: string;
  description: string;
  features: string;
  id: number;
  name: string;
  price: number;
  serviceId: number;
  trialDays: number;
  updated: number;
}

export interface StorageI {
  currentStorage: number;
  storageLeft: number;
  storageLimit: number;
}

export interface SubscriptionsStateI {
  plan: PlanI;
  storage: StorageI;
}

export const state: SubscriptionsStateI = {
  plan: {
    billingCycle: '',
    created: 0,
    currency: '',
    description: '',
    features: '',
    id: 0,
    name: '',
    price: 0,
    serviceId: 0,
    trialDays: 0,
    updated: 0,
  },
  storage: {
    currentStorage: 0,
    storageLeft: 0,
    storageLimit: 0,
  },
};
