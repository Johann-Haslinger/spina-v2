import styled from "@emotion/styled";
import { motion } from "framer-motion";
import tw from "twin.macro";
import { COLOR_ITEMS, COLORS, NAV_LINKS } from "../../base/constants";
import NavigationLinkIcon from "./NavigationLinkIcon";
import { DataTypes, NavigationLinks, SupportedLanguages } from "../../base/enums";
import { ViSpina, ViSpinaColored } from "../../assets/icons";
import { NavLink, useLocation } from "react-router-dom";
import { Fragment, useEffect, useRef, useState } from "react";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import { useAppState } from "../../features/collection/hooks/useAppState";
import { IoHelpOutline, IoLogInOutline, IoLogOutOutline, IoPause, IoPlay, IoSettingsOutline } from "react-icons/io5";
import { useUserData } from "../../hooks/useUserData";
import { useSelectedTheme } from "../../features/collection/hooks/useSelectedTheme";
import { displayButtonTexts, displayHeaderTexts } from "../../utils/displayText";
import { useSelectedLanguage } from "../../hooks/useSelectedLanguage";
import { usePlayingPodcast } from "../../features/collection/hooks/usePlayingPodcast";
import PodcastSheet from "../../features/collection/components/podcasts/PodcastSheet";
import { EntityPropsMapper } from "@leanscope/ecs-engine";
import { TitleFacet, DateAddedFacet, SourceFacet } from "../../app/AdditionalFacets";
import { dataTypeQuery } from "../../utils/queries";
import { Tags } from "@leanscope/ecs-models";

const StyledSelectedPodcasrCellWrapper = styled.div<{ visible: boolean }>`
  ${tw`flex mx-1 z-10 w-[226px] cursor-pointer  md:hover:bg-primary dark:hover:bg-tertiaryDark   absolute bottom-14 my-2 dark:text-white  overflow-hidden py-1 transition-all  rounded-xl space-x-4 items-center`}
  ${({ visible }) => !visible && tw`hidden`}
`;

const StyledSelectedPodcastIcon = styled.div`
  ${tw`text-2xl md:hover:scale-110 bg-primary dark:bg-tertiaryDark transition-all font-black mx-1 size-10 rounded-lg flex items-center justify-center`}
`;
const StyledPodcastTitle = styled.div`
  ${tw`text-sm pr-2 line-clamp-1 font-semibold`}
`;
const StyledPodcastSubtitile = styled.div`
  ${tw`text-sm line-clamp-1 text-seconderyText`}
`;

const SelectedPodcastCell = (props: { isFullWidth: boolean }) => {
  const { isFullWidth } = props;
  const { playingPodcastEntity, playingPodcastTitle, isPlaying, setIsPaused } = usePlayingPodcast();

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
          <StyledPodcastTitle>{playingPodcastTitle}</StyledPodcastTitle>
          <StyledPodcastSubtitile>Podcast</StyledPodcastSubtitile>
        </motion.div>
      </StyledSelectedPodcasrCellWrapper>
    </Fragment>
  );
};

const StyledSettingsMenuWrapper = styled.div`
  ${tw` px-2 py-2 dark:text-primaryTextDark w-56 h-52 bg-secondery  bg-opacity-95 backdrop-blur-xl dark:bg-tertiaryDark rounded-lg`}
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
  ${tw`w-full px-1 py-3  transition-all md:hover:opacity-50   flex items-center `}
`;
const StyledSettingsMenuIcon = styled.div`
  ${tw`text-base mr-3 `}
`;
const StyledSettingsDivider = styled.div`
  ${tw`w-full h-0.5 dark:border-primaryBorderDark border-primaryBorder border-b `}
`;
const StyledSettingsWrapper = styled.div<{ isHoverd: boolean }>`
  ${tw`flex w-[226px] cursor-pointer  md:hover:bg-primary dark:hover:bg-tertiaryDark   mx-1 absolute bottom-0 my-2 dark:text-white  overflow-hidden py-1 transition-all  rounded-xl space-x-4 items-center`}
  ${({ isHoverd }) => isHoverd && tw`xl:bg-primary xl:dark:bg-tertiaryDark`}
`;

const StyledProfileIcon = styled.div<{
  color: string;
  backgroundColor: string;
}>`
  ${tw`text-2xl md:hover:opacity-80 transition-all font-black mx-1 size-10 rounded-lg flex items-center justify-center`}
  color: ${({ color }) => color};
  background-color: ${({ backgroundColor }) => backgroundColor};
`;
const StyledProfileText = styled.div`
  ${tw` font-semibold `}
`;

const SettingsLink = (props: { isFullWidth: boolean }) => {
  const { isFullWidth } = props;
  const { color, backgroundColor } = COLOR_ITEMS[1];
  const { toggleSettings } = useAppState();
  const { selectedLanguage } = useSelectedLanguage();
  const { userEmail, signedIn, signOut } = useUserData();
  const [isSettingsQuickMenuVisible, setIsSettingsQuickMenuVisible] = useState(false);
  const settingsQuickMenuRef = useRef<HTMLDivElement>(null);

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
        }}
        transition={{
          duration: 0.1,
        }}
        initial={{
          bottom: 55,
          opacity: 0,
          zIndex: 0,
        }}
        animate={{
          bottom: isSettingsQuickMenuVisible ? 65 : 55,
          opacity: isSettingsQuickMenuVisible ? 1 : 0,
          zIndex: isSettingsQuickMenuVisible ? 20 : 0,
        }}
      >
        <StyledSettingsMenuWrapper>
          <StyledEmailText>{userEmail}</StyledEmailText>
          <StyledSettingsDivider />
          <StyledHelpText>
            <StyledSettingsMenuIcon>
              <IoHelpOutline />
            </StyledSettingsMenuIcon>
            {displayHeaderTexts(selectedLanguage).whatToDo}
          </StyledHelpText>
          <StyledSettingsText onClick={toggleSettings}>
            <StyledSettingsMenuIcon>
              <IoSettingsOutline />
            </StyledSettingsMenuIcon>
            {displayHeaderTexts(selectedLanguage).settings}
          </StyledSettingsText>
          <StyledSettingsDivider />
          <StyledAccountStatusText onClick={() => signedIn && signOut()}>
            <StyledSettingsMenuIcon>{signedIn ? <IoLogOutOutline /> : <IoLogInOutline />}</StyledSettingsMenuIcon>
            {signedIn ? displayButtonTexts(selectedLanguage).logOut : displayButtonTexts(selectedLanguage).logIn}
          </StyledAccountStatusText>
        </StyledSettingsMenuWrapper>
      </motion.div>
      <StyledSettingsWrapper
        onClick={() => setIsSettingsQuickMenuVisible(!isSettingsQuickMenuVisible)}
        isHoverd={isSettingsQuickMenuVisible}
      >
        <StyledProfileIcon color={color} backgroundColor={backgroundColor}>
          S
        </StyledProfileIcon>
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: isFullWidth ? 0 : -10, opacity: isFullWidth ? 1 : 0 }}
        >
          <StyledProfileText>User</StyledProfileText>
        </motion.div>
      </StyledSettingsWrapper>
    </Fragment>
  );
};

const StyledSidebarLinkWrapper = styled.div<{ isCurrent: boolean }>`
  ${tw`flex my-1.5 dark:text-white md:hover:bg-secondery dark:hover:bg-tertiaryDark overflow-hidden py-3 transition-all px-2 rounded-lg space-x-4 items-center`}
  ${({ isCurrent }) => isCurrent && tw``}
`;
const StyledNavLinkIcon = styled.div<{ color: string }>`
  ${tw`text-2xl  dark:text-white dark:opacity-100 transition-all  px-1.5 rounded-full `}
`;

const selectNavLinkText = (navLink: NavigationLinks, selectedLanguage: SupportedLanguages) => {
  switch (navLink) {
    case NavigationLinks.COLLECTION:
      return displayHeaderTexts(selectedLanguage).collection;
    case NavigationLinks.STUDY:
      return displayHeaderTexts(selectedLanguage).study;
    case NavigationLinks.HOMEWORKS:
      return displayHeaderTexts(selectedLanguage).homeworks;
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

const SidebarLink = (props: { title: NavigationLinks; path: string; idx: number; isFullWidth: boolean }) => {
  const { title, path, idx, isFullWidth: isHoverd } = props;
  const { selectedLanguage } = useSelectedLanguage();
  const { pathname } = useLocation();
  const { toggleSettings, isSettingVisible, toggleSidebar } = useAppState();

  const handleClick = () => {
    toggleSidebar();
    if (isSettingVisible) {
      toggleSettings();
    }
  };

  return (
    <NavLink to={path}>
      <StyledSidebarLinkWrapper onClick={handleClick} isCurrent={path == pathname}>
        <StyledNavLinkIcon color={COLORS[idx]}>
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
  ${tw`w-5 h-5 md:hover:scale-90 transition-all  mb-12 ml-2.5 scale-75`}
`;
const StyledSidebarWrapper = styled.div<{ isFullWidth: boolean }>`
  ${tw`h-full  pt-6 bg-white dark:bg-seconderyDark  transition-all  px-2 rounded-xl backdrop-blur-2xl bg-opacity-95  `}
`;

const Sidebar = () => {
  const { isSidebarVisible, toggleSidebar } = useAppState();
  const { isDarkMode } = useSelectedTheme();
  const { width } = useWindowDimensions();
  const [isHoverd, setIsHoverd] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isMobile = width < 1280;
  const isVisible = isMobile ? isSidebarVisible : true;
  const isFullWidth = isMobile ? true : isHoverd;

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
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
          position: "fixed",
          height: isMobile ? "98%" : "96%",
          top: isMobile ? "1%" : "2%",
          left: isMobile ? "14px" : "1%",
        }}
        initial={{
          width: 72,
          x: -100,
        }}
        transition={{
          duration: isMobile ? 0.2 : 0.6,
          type: isMobile ? "tween" : "spring",
        }}
        animate={{
          width: isFullWidth ? 250 : 72,
          x: isVisible ? 0 : -300,
        }}
      >
        <StyledSidebarWrapper isFullWidth={isFullWidth}>
          <StyledSpinaIcon>{isDarkMode ? <ViSpinaColored /> : <ViSpina />}</StyledSpinaIcon>

          {NAV_LINKS.map((navLink, idx) => (
            <SidebarLink isFullWidth={isFullWidth} key={idx} idx={idx} title={navLink.title} path={navLink.path} />
          ))}
          <SelectedPodcastCell isFullWidth={isFullWidth} />
          <SettingsLink isFullWidth={isFullWidth} />
        </StyledSidebarWrapper>
      </motion.div>

      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataTypes.PODCAST)}
        get={[[TitleFacet, DateAddedFacet, SourceFacet], []]}
        onMatch={PodcastSheet}
      />
    </Fragment>
  );
};

export default Sidebar;
