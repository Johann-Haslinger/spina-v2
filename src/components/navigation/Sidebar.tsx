import styled from "@emotion/styled";
import { useEntities } from "@leanscope/ecs-engine";
import { Tags } from "@leanscope/ecs-models";
import { motion } from "framer-motion";
import { Fragment, useEffect, useRef, useState } from "react";
import {
  IoClose,
  IoEllipsisHorizontal,
  IoLogInOutline,
  IoLogOutOutline,
  IoMoon,
  IoPause,
  IoPersonCircleOutline,
  IoPlay,
  IoSettingsOutline,
} from "react-icons/io5";
import { NavLink, useLocation } from "react-router-dom";
import tw from "twin.macro";
import { ViSpina } from "../../assets/icons";
import {
  COLOR_ITEMS,
  LARGE_DEVICE_WIDTH,
  MEDIUM_DEVICE_WIDTH,
  NAV_LINKS,
} from "../../base/constants";
import {
  NavigationLinks,
  SupportedLanguages,
  SupportedThemes,
} from "../../base/enums";
import { useAppState } from "../../features/collection/hooks/useAppState";
import { usePlayingPodcast } from "../../features/collection/hooks/usePlayingPodcast";
import { useSelectedTheme } from "../../features/collection/hooks/useSelectedTheme";
import { useSelectedLanguage } from "../../hooks/useSelectedLanguage";
import { useUserData } from "../../hooks/useUserData";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import {
  displayAlertTexts,
  displayButtonTexts,
  displayHeaderTexts,
} from "../../utils/displayText";
import NavigationLinkIcon from "./NavigationLinkIcon";

const StyledSelectedPodcasrCellWrapper = styled.div<{ visible: boolean }>`
  ${tw`flex mx-1 w-[226px] cursor-pointer  md:hover:bg-primary dark:hover:bg-tertiaryDark   absolute bottom-14 my-2 dark:text-white  overflow-hidden py-1 transition-all  rounded-xl space-x-4 items-center`}
  ${({ visible }) => !visible && tw`hidden`}
`;

const StyledSelectedPodcastIcon = styled.div`
  ${tw`text-2xl text-primaryColor dark:text-white md:hover:scale-110 bg-primary dark:bg-tertiaryDark transition-all font-black mx-1 size-10 rounded-lg flex items-center justify-center`}
`;
const StyledPodcastTitle = styled.div`
  ${tw`text-sm pr-2 line-clamp-1 font-semibold`}
`;
const StyledPodcastSubtitile = styled.div`
  ${tw`text-sm line-clamp-1 text-seconderyText`}
`;

const SelectedPodcastCell = (props: { isFullWidth: boolean }) => {
  const { isFullWidth } = props;
  const { playingPodcastEntity, playingPodcastTitle, isPlaying, setIsPaused } =
    usePlayingPodcast();
  const { selectedLanguage } = useSelectedLanguage();

  const openPodcastSheet = () => playingPodcastEntity?.add(Tags.SELECTED);

  return (
    <Fragment>
      <StyledSelectedPodcasrCellWrapper
        visible={playingPodcastEntity ? true : false}
      >
        <StyledSelectedPodcastIcon
          onClick={() => (isPlaying ? setIsPaused(true) : setIsPaused(false))}
        >
          {isPlaying ? <IoPause /> : <IoPlay />}
        </StyledSelectedPodcastIcon>
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: isFullWidth ? 0 : -10, opacity: isFullWidth ? 1 : 0 }}
          onClick={openPodcastSheet}
        >
          <StyledPodcastTitle>
            {playingPodcastTitle || displayAlertTexts(selectedLanguage).noTitle}
          </StyledPodcastTitle>
          <StyledPodcastSubtitile>Podcast</StyledPodcastSubtitile>
        </motion.div>
      </StyledSelectedPodcasrCellWrapper>
    </Fragment>
  );
};

const StyledSettingsMenuWrapper = styled.div`
  ${tw` px-2 py-2 dark:text-primaryTextDark md:w-56 w-full h-52 bg-primary dark:bg-tertiaryDark rounded-lg`}
`;

const StyledEmailText = styled.div`
  ${tw`w-full px-1 py-3  text-seconderyText dark:text-seconderyTextDark`}
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
  ${tw`w-full h-0.5 dark:border-primaryBorderDark border-primaryBorder border-b `}
`;
const StyledSettingsWrapper = styled.div<{ isHoverd: boolean }>`
  ${tw`flex w-full ml-3  md:mb-3 md:w-[226px] pr-4 justify-between cursor-pointer  md:hover:bg-primary dark:hover:bg-tertiaryDark  mx-1  my-2 dark:text-white  overflow-hidden py-1 transition-all  rounded-xl space-x-4 items-center`}
  ${({ isHoverd }) =>
    isHoverd && tw`bg-black bg-opacity-[3%] dark:bg-tertiaryDark`}
`;

const StyledLinkSpacer = styled.div`
  ${tw`w-full absolute left-0 right-0  pr-6 md:pl-0 md:pr-0 md:right-auto  bottom-6 md:bottom-0`}
`;

const StyledProfileIcon = styled.div<{
  color: string;
  backgroundColor: string;
}>`
  ${tw`text-2xl  md:hover:opacity-80 transition-all font-black mx-1 size-10 rounded-lg flex items-center justify-center`}
  color: ${({ color }) => color};
  background-color: ${({ backgroundColor }) => backgroundColor};
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
  const { isFullWidth } = props;
  const { color, accentColor: backgroundColor } = COLOR_ITEMS[3];
  const { toggleSettings, toggleProfile } = useAppState();
  const { selectedLanguage } = useSelectedLanguage();
  const { userEmail, signedIn, signOut, userName, profilePicture } =
    useUserData();
  const [isSettingsQuickMenuVisible, setIsSettingsQuickMenuVisible] =
    useState(false);
  const settingsQuickMenuRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowDimensions();
  const isMobile = width < MEDIUM_DEVICE_WIDTH;

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [isSettingsQuickMenuVisible]);

  const handleClickOutside = (e: MouseEvent) => {
    if (
      isSettingsQuickMenuVisible &&
      settingsQuickMenuRef.current &&
      !settingsQuickMenuRef.current.contains(e.target as Node)
    ) {
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
          position: "absolute",
          left: 14,
          right: isMobile ? 14 : "auto",
        }}
        transition={{
          duration: 0.1,
        }}
        initial={{
          bottom: 55,
          opacity: 0,
        }}
        animate={{
          bottom: isSettingsQuickMenuVisible ? (isMobile ? 100 : 65) : 55,
          opacity: isSettingsQuickMenuVisible ? 1 : 0,
        }}
      >
        <StyledSettingsMenuWrapper>
          <StyledEmailText>{userEmail}</StyledEmailText>
          <StyledSettingsDivider />
          {/* <StyledHelpText>
            <StyledSettingsMenuIcon>
              <IoHelpOutline />
            </StyledSettingsMenuIcon>
            {displayHeaderTexts(selectedLanguage).whatToDo}
          </StyledHelpText> */}

          <StyledHelpText onClick={toggleProfile}>
            <StyledSettingsMenuIcon>
              <IoPersonCircleOutline />
            </StyledSettingsMenuIcon>
            {displayHeaderTexts(selectedLanguage).profile}
          </StyledHelpText>
          <StyledSettingsText onClick={toggleSettings}>
            <StyledSettingsMenuIcon>
              <IoSettingsOutline />
            </StyledSettingsMenuIcon>
            {displayHeaderTexts(selectedLanguage).settings}
          </StyledSettingsText>
          <StyledSettingsDivider />
          <StyledAccountStatusText onClick={() => signedIn && signOut()}>
            <StyledSettingsMenuIcon>
              {signedIn ? <IoLogOutOutline /> : <IoLogInOutline />}
            </StyledSettingsMenuIcon>
            {signedIn
              ? displayButtonTexts(selectedLanguage).logOut
              : displayButtonTexts(selectedLanguage).logIn}
          </StyledAccountStatusText>
        </StyledSettingsMenuWrapper>
      </motion.div>

      <StyledLinkSpacer>
        <StyledSettingsWrapper
          onClick={() =>
            setIsSettingsQuickMenuVisible(!isSettingsQuickMenuVisible)
          }
          isHoverd={isSettingsQuickMenuVisible}
        >
          <StyledLeftSideWrapper>
            {profilePicture ? (
              <StyledProfilePicture src={profilePicture} />
            ) : (
              <StyledProfileIcon
                color={color}
                backgroundColor={backgroundColor}
              >
                S
              </StyledProfileIcon>
            )}
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{
                x: isFullWidth ? 0 : -10,
                opacity: isFullWidth ? 1 : 0,
              }}
            >
              <StyledProfileText>
                {userName ? userName : "Account"}
              </StyledProfileText>
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
  ${tw`flex my-1.5 dark:text-white md:hover:bg-secondery dark:hover:bg-tertiaryDark overflow-hidden py-3 transition-all px-2 rounded-lg space-x-4 items-center`}
  ${({ isCurrent }) =>
    isCurrent && tw`bg-black bg-opacity-[3%] dark:bg-tertiaryDark`}
`;
const StyledNavLinkIcon = styled.div<{ color: string }>`
  ${tw`text-2xl opacity-80 dark:text-white  dark:opacity-100 transition-all  px-2 rounded-lg  `}
  color: ${({ color }) => color};
`;

const selectNavLinkText = (
  navLink: NavigationLinks,
  selectedLanguage: SupportedLanguages,
) => {
  switch (navLink) {
    case NavigationLinks.COLLECTION:
      return displayHeaderTexts(selectedLanguage).collection;
    case NavigationLinks.STUDY:
      return displayHeaderTexts(selectedLanguage).study;
    case NavigationLinks.HOMEWORKS:
      return displayHeaderTexts(selectedLanguage).homeworks;
    case NavigationLinks.FLASHCARDS:
      return displayHeaderTexts(selectedLanguage).flashcards;
    case NavigationLinks.EXAMS:
      return displayHeaderTexts(selectedLanguage).exams;
    case NavigationLinks.OVERVIEW:
      return displayHeaderTexts(selectedLanguage).overview;
    case NavigationLinks.GROUPS:
      return displayHeaderTexts(selectedLanguage).groups;
    default:
      return "";
  }
};

const SidebarLink = (props: {
  title: NavigationLinks;
  path: string;
  idx: number;
  isFullWidth: boolean;
}) => {
  const { title, path, idx, isFullWidth: isHoverd } = props;
  const { selectedLanguage } = useSelectedLanguage();
  const { pathname } = useLocation();
  const { toggleSettings, isSettingVisible, toggleSidebar } = useAppState();
  const [selectedEntities] = useEntities((e) => e.has(Tags.SELECTED));

  const handleClick = () => {
    selectedEntities.forEach((e) => e.remove(Tags.SELECTED));

    toggleSidebar();
    if (isSettingVisible) {
      toggleSettings();
    }
  };

  return (
    <NavLink to={path}>
      <StyledSidebarLinkWrapper
        onClick={handleClick}
        isCurrent={path == pathname && isHoverd}
      >
        <StyledNavLinkIcon color={COLOR_ITEMS[idx].accentColor}>
          <NavigationLinkIcon navLink={title} />
        </StyledNavLinkIcon>

        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: isHoverd ? 0 : -10, opacity: isHoverd ? 1 : 0 }}
        >
          {selectNavLinkText(title, selectedLanguage)}
        </motion.div>
      </StyledSidebarLinkWrapper>
    </NavLink>
  );
};

const StyledSpinaIcon = styled.div`
  ${tw` flex w-[54px] justify-center text-3xl dark:text-primaryTextDark h-5 md:hover:scale-90 transition-all  mb-12  scale-75`}
`;
const StyledSidebarWrapper = styled.div<{ isFullWidth: boolean }>`
  ${tw`h-full md:rounded-xl pt-6 bg-white dark:bg-seconderyDark  transition-all  px-2 backdrop-blur-2xl bg-opacity-95  `}
`;

const Sidebar = () => {
  const { isSidebarVisible, toggleSidebar } = useAppState();
  const { isDarkMode, changeTheme } = useSelectedTheme();
  const { width } = useWindowDimensions();
  const [isHoverd, setIsHoverd] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isMobile = width < MEDIUM_DEVICE_WIDTH;
  const isMediumDevice = width < LARGE_DEVICE_WIDTH;
  const isVisible = isMediumDevice ? isSidebarVisible : true;
  const isFullWidth = isMediumDevice ? true : isHoverd;

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [isSidebarVisible]);

  const handleClickOutside = (e: MouseEvent) => {
    if (
      isSidebarVisible &&
      sidebarRef.current &&
      !sidebarRef.current.contains(e.target as Node)
    ) {
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
          position: "fixed",
          height: isMobile ? "100%" : "96%",
          top: isMobile ? "0" : "2%",
          left: isMobile ? "0" : "1%",
          zIndex: 20,
        }}
        initial={{
          width: 72,
          x: isMediumDevice ? "-110%" : -100,
        }}
        transition={{
          duration: isMobile ? 0.2 : 0.6,
          type: isMobile ? "tween" : "spring",
        }}
        animate={{
          width: isMobile ? "100%" : isFullWidth ? 250 : 72,
          x: isVisible ? 0 : isMediumDevice ? "-110%" : -300,
        }}
      >
        <StyledSidebarWrapper isFullWidth={isFullWidth}>
          <StyledSpinaIcon
            onClick={
              isMobile
                ? toggleSidebar
                : () =>
                    changeTheme(
                      isDarkMode ? SupportedThemes.LIGHT : SupportedThemes.DARK,
                    )
            }
          >
            {isMobile ? <IoClose /> : isDarkMode ? <IoMoon /> : <ViSpina />}
          </StyledSpinaIcon>

          {NAV_LINKS.map((navLink, idx) => (
            <SidebarLink
              isFullWidth={isFullWidth}
              key={idx}
              idx={idx}
              title={navLink.title}
              path={navLink.path}
            />
          ))}
          <SelectedPodcastCell isFullWidth={isFullWidth} />
          <SettingsLink isFullWidth={isFullWidth} />
        </StyledSidebarWrapper>
      </motion.div>
    </Fragment>
  );
};

export default Sidebar;
