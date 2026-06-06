export const getAuthProviderRedirectUrl = (): string => {
  const { VUE_APP_DG_USERS_APP } = process.env;
  const path = window.location.pathname;
  const query = window.location.search;
  const redirect = encodeURIComponent(`${path}${query}`);

  return `${VUE_APP_DG_USERS_APP}/auth/provider?app=sky&redirect=${redirect}`;
};
