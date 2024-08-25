import { IoBook, IoCopy, IoGrid, IoHome, IoJournal, IoPeople, IoTrophy } from 'react-icons/io5';
import { NavigationLinks } from '../../base/enums';

const NavigationLinkIcon = (props: { navLink: NavigationLinks }) => {
  switch (props.navLink) {
    case NavigationLinks.OVERVIEW:
      return <IoHome />;
    case NavigationLinks.HOMEWORKS:
      return <IoJournal />;
    case NavigationLinks.EXAMS:
      return <IoTrophy />;
    case NavigationLinks.COLLECTION:
      return <IoGrid />;
    case NavigationLinks.GROUPS:
      return <IoPeople />;
    case NavigationLinks.FLASHCARDS:
      return <IoCopy />;

    default:
      return <IoBook />;
  }
};

export default NavigationLinkIcon;
