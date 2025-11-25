export interface PaginationI {
  page: number;
  limit: number;
  query: string;
}

export interface RootStateI {
  version: string;
  sidebar: boolean;
  pagination: PaginationI;
}

export interface OptionI {
  content: string;
  action: string;
}

export const state: RootStateI = {
  version: '0.0.1',
  sidebar: false,
  pagination: {
    page: 1,
    limit: 100,
    query: '',
  },
};
