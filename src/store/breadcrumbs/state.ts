export interface BreadcrumbI {
  id: string | number;
  name: string;
  type: string;
}

export interface BreadcrumbsStateI {
  breadcrumbs: BreadcrumbI[];
}

export const state: BreadcrumbsStateI = {
  breadcrumbs: [],
};
