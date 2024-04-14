import { AppPages } from "./enums";

export const NAV_LINKS = [
  {
    title: AppPages.OVERVIEW,
    path: "/" + AppPages.OVERVIEW.toLowerCase(),
  },
  {
    title: AppPages.HOMEWORKS,
    path: "/" + AppPages.HOMEWORKS.toLowerCase(),
  },
  {
    title: AppPages.EXAMS,
    path: "/" + AppPages.EXAMS.toLowerCase(),
  },
  {
    title: AppPages.COLLECTION,
    path: "/" + AppPages.COLLECTION.toLowerCase(),
  },
  {
    title: AppPages.GROUPS,
    path: "/" + AppPages.GROUPS.toLowerCase(),
  },
];
