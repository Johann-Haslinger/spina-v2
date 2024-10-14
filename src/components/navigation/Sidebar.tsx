import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Tags } from '@leanscope/ecs-models';
import { motion } from 'framer-motion';
import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import {
  IoClose,
  IoEllipsisHorizontal,
  IoHelpCircleOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoMoon,
  IoPause,
  IoPerson,
  IoPlay,
  IoSettingsOutline,
} from 'react-icons/io5';
import { NavLink, useLocation } from 'react-router-dom';
import tw from 'twin.macro';
import { ViSpina } from '../../assets/icons';
import { COLOR_ITEMS, MEDIUM_DEVICE_WIDTH, NAV_LINKS } from '../../base/constants';
import { NavigationLink, Story, SupportedLanguage, SupportedTheme } from '../../base/enums';
import { useAppState } from '../../features/collection/hooks/useAppState';
import { usePlayingPodcast } from '../../features/collection/hooks/usePlayingPodcast';
import { useSelectedTheme } from '../../features/collection/hooks/useSelectedTheme';
import { useSelectedLanguage } from '../../hooks/useSelectedLanguage';
import { useUserData } from '../../hooks/useUserData';
import { useWindowDimensions } from '../../hooks/useWindowDimensions';
import { displayAlertTexts, displayButtonTexts, displayHeaderTexts } from '../../utils/displayText';
import NavigationLinkIcon from './NavigationLinkIcon';

const StyledSelectedPodcasrCellWrapper = styled.div<{ visible: boolean }>`
  ${tw`flex mx-1 w-[226px] cursor-pointer  md:hover:bg-primary dark:hover:bg-tertiary-dark   absolute bottom-14 my-2 dark:text-white  overflow-hidden py-1 transition-all  rounded-xl space-x-4 items-center`}
  ${({ visible }) => !visible && tw`hidden`}
`;

const StyledSelectedPodcastIcon = styled.div`
  ${tw`text-2xl text-primary-color dark:text-white md:hover:scale-110 bg-primary dark:bg-tertiary-dark transition-all font-black mx-1 size-10 rounded-lg flex items-center justify-center`}
`;
const StyledPodcastTitle = styled.div`
  ${tw`text-sm pr-2 line-clamp-1 font-semibold`}
`;
const StyledPodcastSubtitile = styled.div`
  ${tw`text-sm line-clamp-1 text-secondary-text`}
`;

const SelectedPodcastCell = (props: { isFullWidth: boolean }) => {
  const { isFullWidth } = props;
  const { playingPodcastEntity, playingPodcastTitle, isPlaying, setIsPaused } = usePlayingPodcast();
  const { selectedLanguage } = useSelectedLanguage();

  const openPodcastSheet = () => playingPodcastEntity?.add(Tags.SELECTED);

  return (
    <Fragment>
      <StyledSelectedPodcasrCellWrapper visible={playingPodcastEntity ? true : false}>
        <StyledSelectedPodcastIcon onClick={() => (isPlaying ? setIsPaused(true) : setIsPaused(false))}>
          {isPlaying ? <IoPause /> : <IoPlay />}
        </StyledSelectedPodcastIcon>
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: isFullWidth ? 0 : -10, opacity: isFullWidth ? 1 : 0 }}
          onClick={openPodcastSheet}
        >
          <StyledPodcastTitle>{playingPodcastTitle || displayAlertTexts(selectedLanguage).noTitle}</StyledPodcastTitle>
          <StyledPodcastSubtitile>Podcast</StyledPodcastSubtitile>
        </motion.div>
      </StyledSelectedPodcasrCellWrapper>
    </Fragment>
  );
};

const StyledSettingsMenuWrapper = styled.div`
  ${tw` px-2  dark:text-primary-text-dark md:w-56 w-full h-48 bg-primary dark:bg-tertiary-dark rounded-lg`}
`;

const StyledEmailText = styled.div`
  ${tw`w-full px-1 py-3  text-secondary-text dark:text-secondary-text-dark`}
`;

const StyledHelpText = styled.div`
  ${tw`w-full px-1 py-3  transition-all md:hover:opacity-50 flex items-center `}
`;

const StyledSettingsText = styled.div`
  ${tw`w-full px-1 pb-3  transition-all md:hover:opacity-50  pt-1 flex items-center  `}
`;
const StyledAccountStatusText = styled.div`
  ${tw`w-full px-1 py-3   transition-all md:hover:opacity-50   flex items-center `}
`;
const StyledSettingsMenuIcon = styled.div`
  ${tw`text-base mr-3`}
`;
const StyledSettingsDivider = styled.div`
  ${tw`w-full h-0.5 dark:border-primary-border-dark border-primary-border border-b `}
`;
const StyledSettingsWrapper = styled.div<{ isHoverd: boolean }>`
  ${tw`flex w-full ml-3  md:mb-3 md:w-[226px] pr-4 justify-between cursor-pointer  md:hover:bg-primary dark:hover:bg-tertiary-dark  mx-1  my-2 dark:text-white  overflow-hidden py-1 transition-all  rounded-xl space-x-4 items-center`}
  ${({ isHoverd }) => isHoverd && tw`bg-black bg-opacity-[3%] dark:bg-tertiary-dark`}
`;

const StyledLinkSpacer = styled.div`
  ${tw`w-full absolute left-0 right-0  pr-6 md:pl-0 md:pr-0 md:right-auto  bottom-6 md:bottom-0`}
`;

const StyledProfileIcon = styled.div<{
  color: string;
  backgroundColor: string;
}>`
  ${tw`text-xl  transition-all font-black mx-1 size-10 rounded-lg flex items-center justify-center`}
  color: ${({ color }) => color};
  background-color: ${({ backgroundColor }) => backgroundColor + 50};
`;
const StyledProfileText = styled.div`
  ${tw`text-lg md:text-base ml-3 font-medium `}
`;

const StyledLeftSideWrapper = styled.div`
  ${tw`flex w-fit items-center`}
`;

const StyledProfileIconWrapper = styled.div`
  ${tw`text-xl md:hidden`}
`;

const StyledProfilePicture = styled.img`
  ${tw`w-10 h-10 rounded-full`}
`;

const SettingsLink = (props: { isFullWidth: boolean }) => {
  const lsc = useContext(LeanScopeClientContext);
  const { isFullWidth } = props;
  const { color } = COLOR_ITEMS[3];
  const { selectedLanguage } = useSelectedLanguage();
  const { userEmail, signedIn, signOut, userName, profilePicture } = useUserData();
  const [isSettingsQuickMenuVisible, setIsSettingsQuickMenuVisible] = useState(false);
  const settingsQuickMenuRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowDimensions();
  const isMobile = width < MEDIUM_DEVICE_WIDTH;
  const { toggleSidebar } = useAppState();

  const openSettings = () => lsc.stories.transitTo(Story.OBSERVING_SETTINGS_OVERVIEW_STORY);
  const openContactForm = () => lsc.stories.transitTo(Story.OBSERVING_REPORT_PROBLEM_STORY);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [isSettingsQuickMenuVisible]);

  const handleClickOutside = () => {
    if (isSettingsQuickMenuVisible) {
      setIsSettingsQuickMenuVisible(false);
    }
  };

  useEffect(() => {
    if (!isFullWidth) {
      setIsSettingsQuickMenuVisible(false);
    }
  }, [isFullWidth]);

  return (
    <Fragment>
      <motion.div
        ref={settingsQuickMenuRef}
        style={{
          position: 'absolute',
          left: 14,
          right: isMobile ? 14 : 'auto',
        }}
        transition={{
          duration: 0.1,
        }}
        initial={{
          bottom: 55,
          opacity: 0,
        }}
        animate={{
          bottom: isSettingsQuickMenuVisible ? (isMobile ? 100 : 70) : 55,
          opacity: isSettingsQuickMenuVisible ? 1 : 0,
        }}
        onClick={toggleSidebar}
      >
        <StyledSettingsMenuWrapper>
          <StyledEmailText>{userEmail}</StyledEmailText>
          <StyledSettingsDivider />

          <StyledHelpText onClick={openSettings}>
            <StyledSettingsMenuIcon>
              <IoSettingsOutline />
            </StyledSettingsMenuIcon>
            {displayHeaderTexts(selectedLanguage).settings}
          </StyledHelpText>
          <StyledSettingsText onClick={openContactForm}>
            <StyledSettingsMenuIcon>
              <IoHelpCircleOutline />
            </StyledSettingsMenuIcon>
            Problem melden
          </StyledSettingsText>
          <StyledSettingsDivider />
          <StyledAccountStatusText onClick={() => signedIn && signOut()}>
            <StyledSettingsMenuIcon>{signedIn ? <IoLogOutOutline /> : <IoLogInOutline />}</StyledSettingsMenuIcon>
            {signedIn ? displayButtonTexts(selectedLanguage).logOut : displayButtonTexts(selectedLanguage).logIn}
          </StyledAccountStatusText>
        </StyledSettingsMenuWrapper>
      </motion.div>

      <StyledLinkSpacer>
        <StyledSettingsWrapper
          onClick={() => setIsSettingsQuickMenuVisible(!isSettingsQuickMenuVisible)}
          isHoverd={isSettingsQuickMenuVisible}
        >
          <StyledLeftSideWrapper>
            {profilePicture ? (
              <StyledProfilePicture src={profilePicture} />
            ) : (
              <StyledProfileIcon color={color} backgroundColor={color}>
                <IoPerson />
              </StyledProfileIcon>
            )}
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{
                x: isFullWidth ? 0 : -10,
                opacity: isFullWidth ? 1 : 0,
              }}
            >
              <StyledProfileText>{userName ? userName : 'Account'}</StyledProfileText>
            </motion.div>
          </StyledLeftSideWrapper>

          <StyledProfileIconWrapper>
            <IoEllipsisHorizontal />
          </StyledProfileIconWrapper>
        </StyledSettingsWrapper>
      </StyledLinkSpacer>
    </Fragment>
  );
};

const StyledSidebarLinkWrapper = styled.div<{ isCurrent: boolean }>`
  ${tw`flex my-1.5  dark:text-white md:hover:bg-secondary dark:hover:bg-tertiary-dark overflow-hidden py-3 transition-all px-2 rounded-lg space-x-4 items-center`}
  ${({ isCurrent }) => isCurrent && tw`bg-black bg-opacity-[3%] dark:bg-tertiary-dark`}
`;
const StyledNavLinkIcon = styled.div<{ color: string }>`
  ${tw`text-2xl opacity-80 dark:text-white  dark:opacity-100 transition-all  px-2 rounded-lg  `}
  color: ${({ color }) => color};
`;

const selectNavLinkText = (navLink: NavigationLink, selectedLanguage: SupportedLanguage) => {
  switch (navLink) {
    case NavigationLink.COLLECTION:
      return displayHeaderTexts(selectedLanguage).collection;
    case NavigationLink.STUDY:
      return displayHeaderTexts(selectedLanguage).study;
    case NavigationLink.HOMEWORKS:
      return displayHeaderTexts(selectedLanguage).homeworks;
    case NavigationLink.FLASHCARDS:
      return displayHeaderTexts(selectedLanguage).flashcards;
    case NavigationLink.EXAMS:
      return displayHeaderTexts(selectedLanguage).exams;
    case NavigationLink.OVERVIEW:
      return displayHeaderTexts(selectedLanguage).overview;
    case NavigationLink.GROUPS:
      return displayHeaderTexts(selectedLanguage).groups;
    default:
      return '';
  }
};

const SidebarLink = (props: { title: NavigationLink; path: string; idx: number; isFullWidth: boolean }) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, path, idx, isFullWidth: isHoverd } = props;
  const { selectedLanguage } = useSelectedLanguage();
  const { pathname } = useLocation();
  const { toggleSettings, isSettingVisible, toggleSidebar } = useAppState();

  const handleClick = () => {
    lsc.engine.entities.filter((e) => e.has(Tags.SELECTED)).forEach((e) => e.remove(Tags.SELECTED));

    toggleSidebar();
    if (isSettingVisible) {
      toggleSettings();
    }
  };

  return (
    <NavLink to={path}>
      <StyledSidebarLinkWrapper onClick={handleClick} isCurrent={path == pathname && isHoverd}>
        <StyledNavLinkIcon color={COLOR_ITEMS[idx].color}>
          <NavigationLinkIcon navLink={title} />
        </StyledNavLinkIcon>

        <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: isHoverd ? 0 : -10, opacity: isHoverd ? 1 : 0 }}>
          {selectNavLinkText(title, selectedLanguage)}
        </motion.div>
      </StyledSidebarLinkWrapper>
    </NavLink>
  );
};

const StyledSpinaIcon = styled.div`
  ${tw` flex w-[54px] justify-center text-3xl dark:text-primary-text-dark h-5 md:hover:scale-90 transition-all  mb-12  scale-75`}
`;
const StyledSidebarWrapper = styled.div<{ isFullWidth: boolean }>`
  ${tw`h-full md:rounded-xl pt-6 bg-white dark:bg-secondary-dark  transition-all  px-2 backdrop-blur-2xl bg-opacity-95  `}
`;

const Sidebar = () => {
  const { isSidebarVisible, toggleSidebar } = useAppState();
  const { isDarkModeActive: isDarkMode, changeTheme } = useSelectedTheme();
  const { width } = useWindowDimensions();
  const [isHoverd, setIsHoverd] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isMobile = width < MEDIUM_DEVICE_WIDTH;
  const isMediumDevice = true;
  const isVisible = isMediumDevice ? isSidebarVisible : true;
  const isFullWidth = isMediumDevice ? true : isHoverd;

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [isSidebarVisible]);

  const handleClickOutside = (e: MouseEvent) => {
    if (isSidebarVisible && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
      toggleSidebar();
    }
  };

  return (
    <Fragment>
      <motion.div
        ref={sidebarRef}
        onHoverStart={() => setIsHoverd(true)}
        onHoverEnd={() => setIsHoverd(false)}
        style={{
          position: 'fixed',
          height: isMobile ? '100%' : '96%',
          top: isMobile ? '0' : '2%',
          left: isMobile ? '0' : '1%',
          zIndex: 20,
        }}
        initial={{
          opacity: 0,
          width: 72,
          x: isMediumDevice ? '-110%' : -100,
        }}
        transition={{
          duration: isMobile ? 0.2 : 0.6,
          type: isMobile ? 'tween' : 'spring',
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          width: isMobile ? '100%' : isFullWidth ? 250 : 72,
          x: isVisible ? 0 : isMediumDevice ? '-110%' : -300,
        }}
      >
        <StyledSidebarWrapper isFullWidth={isFullWidth}>
          <StyledSpinaIcon
            onClick={
              isMobile ? toggleSidebar : () => changeTheme(isDarkMode ? SupportedTheme.LIGHT : SupportedTheme.DARK)
            }
          >
            {isMobile ? <IoClose /> : isDarkMode ? <IoMoon /> : <ViSpina />}
          </StyledSpinaIcon>

          {NAV_LINKS.map((navLink, idx) => (
            <SidebarLink isFullWidth={isFullWidth} key={idx} idx={idx} title={navLink.title} path={navLink.path} />
          ))}
          <SelectedPodcastCell isFullWidth={isFullWidth} />
          <SettingsLink isFullWidth={isFullWidth} />
        </StyledSidebarWrapper>
      </motion.div>
    </Fragment>
  );
};

export default Sidebar;
