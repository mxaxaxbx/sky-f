export interface RootStateI {
  version: string;
  sidebar: boolean;
}

export interface OptionI {
  content: string;
  action: string;
}

export const state: RootStateI = {
  version: '0.0.1',
  sidebar: false,
};
