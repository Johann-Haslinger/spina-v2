import React from "react";
import { NavigationLinks } from "../../base/enums";
import {
  LuBook,
  LuBookOpen,
  LuGraduationCap,
  LuHome,
  LuLayoutGrid,
  LuTrophy,
  LuUsers,
} from "react-icons/lu";

const NavigationLinkIcon = (props: { navLink: NavigationLinks }) => {
  switch (props.navLink) {
    case NavigationLinks.OVERVIEW:
      return <LuHome  />;
    case NavigationLinks.HOMEWORKS:
      return <LuBook />;
    case NavigationLinks.EXAMS:
      return <LuTrophy />;
    case NavigationLinks.COLLECTION:
      return <LuLayoutGrid />;
    case NavigationLinks.GROUPS:
      return <LuUsers />;

    default:
      return <LuBookOpen />;
  }
};

export default NavigationLinkIcon;
