import { NavigationLinks } from "../../base/enums";
import {
  IoBook,
  IoBookOutline,
  IoGrid,
  IoGridOutline,
  IoHome,
  IoHomeOutline,
  IoJournal,
  IoPeople,
  IoPeopleOutline,
  IoTrophy,
  IoTrophyOutline,
} from "react-icons/io5";

const NavigationLinkIcon = (props: { navLink: NavigationLinks }) => {
  switch (props.navLink) {
    case NavigationLinks.OVERVIEW:
      return <IoHome />;
    case NavigationLinks.STUDY:
      return <IoBook />;
    case NavigationLinks.HOMEWORKS:
      return <IoJournal />;
    case NavigationLinks.EXAMS:
      return <IoTrophy />;
    case NavigationLinks.COLLECTION:
      return <IoGrid />;
    case NavigationLinks.GROUPS:
      return <IoPeople />;

    default:
      return <IoBook />;
  }
};

export default NavigationLinkIcon;
