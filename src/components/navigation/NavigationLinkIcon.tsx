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
import { IoBook, IoGrid, IoHome, IoPeople, IoTrophy } from "react-icons/io5";

const NavigationLinkIcon = (props: { navLink: NavigationLinks }) => {
  switch (props.navLink) {
    case NavigationLinks.OVERVIEW:
      return <IoHome  />;
    case NavigationLinks.HOMEWORKS:
      return <IoBook />;
    case NavigationLinks.EXAMS:
      return <IoTrophy />;
    case NavigationLinks.COLLECTION:
      return <IoGrid />;
    case NavigationLinks.GROUPS:
      return <IoPeople />;

    default:
      return <LuBookOpen />;
  }
};

export default NavigationLinkIcon;
