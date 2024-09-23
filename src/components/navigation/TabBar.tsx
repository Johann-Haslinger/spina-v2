import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Tags } from '@leanscope/ecs-models';
import { useContext } from 'react';
import { IoCopy, IoGrid, IoHome } from 'react-icons/io5';
import { NavLink, useLocation } from 'react-router-dom';
import tw from 'twin.macro';
import { AdditionalTag } from '../../base/enums';

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
  // {
  //   link: '/Profile',
  //   icon: <IoPersonCircle />,
  //   title: 'Du',
  // },
];

const StyledTabBarContainer = tw.div`md:hidden fixed left-0  pt-4   bg-secondary bg-opacity-80 dark:bg-opacity-60 dark:bg-primary-dark  backdrop-blur-2xl  bottom-0 flex justify-between w-screen `;

const StyledTabWrapper = styled(NavLink)<{ active: string }>`
  ${tw`w-full  pb-7  `}
  ${({ active }) => (active == 'true' ? tw`text-primary-color` : tw`text-[#A2A2A2] dark:text-opacity-70`)}
`;

const TabBar = () => {
  const lsc = useContext(LeanScopeClientContext);
  const location = useLocation();

  const handleTabClick = () =>
    lsc.engine.entities.filter((e) => e.has(Tags.SELECTED)).forEach((e) => e.add(AdditionalTag.NAVIGATE_BACK));
  return (
    <StyledTabBarContainer>
      {TABS.map((tab, idx) => {
        return (
          <StyledTabWrapper
            onClick={handleTabClick}
            active={location.pathname === tab.link ? 'true' : 'false'}
            key={idx}
            to={tab.link}
          >
            <div tw="pb-0.5 flex justify-center text-[1.6rem]"> {tab.icon}</div>
            <p tw=" text-[0.6rem] text-center">{tab.title}</p>
          </StyledTabWrapper>
        );
      })}
    </StyledTabBarContainer>
  );
};

export default TabBar;
