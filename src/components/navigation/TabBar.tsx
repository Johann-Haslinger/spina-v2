import styled from '@emotion/styled';
import { IoCopy, IoGrid, IoHome, IoPersonCircle } from 'react-icons/io5';
import { NavLink, useLocation } from 'react-router-dom';
import tw from 'twin.macro';

const TABS = [
  {
    link: '/Flashcards',
    icon: <IoCopy />,
    title: 'Lernkarten',
  },
  {
    link: '/',
    icon: <IoHome />,
    title: 'Übersicht',
  },
  {
    link: '/Collection',
    icon: <IoGrid />,
    title: 'Sammlung',
  },
  {
    link: '/Profile',
    icon: <IoPersonCircle />,
    title: 'Du',
  },
];

const StyledTabBarContainer = tw.div`md:hidden fixed left-0  pt-4   bg-secondery bg-opacity-80 dark:bg-opacity-60 dark:bg-primaryDark  backdrop-blur-2xl  bottom-0 flex justify-between w-screen `;

const StyledTabWrapper = styled(NavLink)<{ isActive: boolean }>`
  ${tw`w-full  pb-7  `}
  ${({ isActive }) => (isActive ? tw`text-primaryColor` : tw`text-[#A2A2A2] dark:text-opacity-70`)}
`;

const TabBar = () => {
  const location = useLocation();

  return (
    <StyledTabBarContainer>
      {TABS.map((tab, idx) => {
        return (
          <StyledTabWrapper isActive={location.pathname === tab.link} key={idx} to={tab.link}>
            <div tw="pb-0.5 flex justify-center text-[1.6rem]"> {tab.icon}</div>
            <p tw=" text-[0.6rem] text-center">{tab.title}</p>
          </StyledTabWrapper>
        );
      })}
    </StyledTabBarContainer>
  );
};

export default TabBar;
