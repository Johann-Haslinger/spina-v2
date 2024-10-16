import { IoBook, IoCopy, IoGrid, IoHome, IoJournal, IoPeople, IoTrophy } from 'react-icons/io5';
import { NavigationLink } from '../../common/types/enums';

const NavigationLinkIcon = (props: { navLink: NavigationLink }) => {
  switch (props.navLink) {
    case NavigationLink.OVERVIEW:
      return <IoHome />;
    case NavigationLink.HOMEWORKS:
      return <IoJournal />;
    case NavigationLink.EXAMS:
      return <IoTrophy />;
    case NavigationLink.COLLECTION:
      return <IoGrid />;
    case NavigationLink.GROUPS:
      return <IoPeople />;
    case NavigationLink.FLASHCARDS:
      return <IoCopy />;

    default:
      return <IoBook />;
  }
};

export default NavigationLinkIcon;
