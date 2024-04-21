import React from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import tw from "twin.macro";
import { COLOR_ITEMS, COLORS, NAV_LINKS } from "../../base/constants";
import NavigationLinkIcon from "./NavigationLinkIcon";
import { NavigationLinks } from "../../base/enums";
import { ViSpina } from "../../assets/icons";
import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import { useAppState } from "../../features/collection/hooks/useAppState";
import {
  IoHelpOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { useUserData } from "../../hooks/useUserData";

const StyledSettingsMenuWrapper = styled.div`
  ${tw` px-2 py-2 dark:text-primaryTextDark w-56 h-52 bg-secondery  bg-opacity-95 backdrop-blur-xl dark:bg-primaryDark rounded-lg`}
`;

const StyledEmailText = styled.div`
  ${tw`w-full px-1 py-3  text-seconderyText dark:text-seconderyTextDark`}
`;

const StyledHelpText = styled.div`
  ${tw`w-full px-1 py-3  transition-all hover:opacity-50 flex items-center `}
`;

const StyledSettingsText = styled.div`
  ${tw`w-full px-1 pb-3  transition-all hover:opacity-50  pt-1 flex items-center  `}
`;
const StyledAccountStatusText = styled.div`
  ${tw`w-full px-1 py-3  transition-all hover:opacity-50   flex items-center `}
`;
const StyledSettingsMenuIcon = styled.div`
  ${tw`text-base mr-3 `}
`;
const StyledSettingsDivider = styled.div`
  ${tw`w-full h-0.5 dark:border-primaryBorderDark border-primaryBorder border-b `}
`;
const StyledSettingsWrapper = styled.div<{ isHoverd: boolean }>`
  ${tw`flex w-[226px] cursor-pointer  hover:bg-primary dark:hover:bg-black   mx-1 absolute bottom-0 my-2 dark:text-white  overflow-hidden py-1 transition-all  rounded-xl space-x-4 items-center`}
  ${({ isHoverd }) => isHoverd && tw`bg-primary dark:bg-black`}
`;

const StyledProfileIcon = styled.div<{
  color: string;
  backgroundColor: string;
}>`
  ${tw`text-2xl hover:opacity-90 transition-all font-black mx-1 size-10 rounded-lg flex items-center justify-center`}
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
  const { userEmail, signedIn} = useUserData();
  const [isSettingsMenuVisible, setIsSettingsMenuVisible] = useState(false);

  useEffect(() => {
    if (!isFullWidth) {
      setIsSettingsMenuVisible(false);
    }
  }, [isFullWidth]);

  return (
    <>
      <motion.div
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
        }}
        animate={{
          bottom: isSettingsMenuVisible ? 65 : 55,
          opacity: isSettingsMenuVisible ? 1 : 0,
        }}
      >
        <StyledSettingsMenuWrapper>
          <StyledEmailText>{userEmail}</StyledEmailText>
          <StyledSettingsDivider />
          <StyledHelpText>
            <StyledSettingsMenuIcon>
              <IoHelpOutline />
            </StyledSettingsMenuIcon>
            What to do
          </StyledHelpText>
          <StyledSettingsText onClick={toggleSettings}>
            <StyledSettingsMenuIcon>
              <IoSettingsOutline />
            </StyledSettingsMenuIcon>
            Settings
          </StyledSettingsText>
          <StyledSettingsDivider />
          <StyledAccountStatusText>
            <StyledSettingsMenuIcon>
            {signedIn ? <IoLogOutOutline /> : <IoLogInOutline />}
            </StyledSettingsMenuIcon>
            {signedIn ? "Logout" : "Login"}
          </StyledAccountStatusText>
        </StyledSettingsMenuWrapper>
      </motion.div>
      <StyledSettingsWrapper
        onClick={() => setIsSettingsMenuVisible(!isSettingsMenuVisible)}
        isHoverd={isSettingsMenuVisible}
      >
        <StyledProfileIcon color={color} backgroundColor={backgroundColor}>
          J
        </StyledProfileIcon>
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: isFullWidth ? 0 : -10, opacity: isFullWidth ? 1 : 0 }}
        >
          <StyledProfileText>Johann</StyledProfileText>
        </motion.div>
      </StyledSettingsWrapper>
    </>
  );
};

const StyledSidebarLinkWrapper = styled.div<{ isCurrent: boolean }>`
  ${tw`flex my-1.5 dark:text-white hover:bg-secondery dark:hover:bg-black overflow-hidden py-3 transition-all px-2 rounded-lg space-x-4 items-center`}
  ${({ isCurrent }) => isCurrent && tw``}
`;
const StyledNavLinkIcon = styled.div<{ color: string }>`
  ${tw`text-2xl text-black dark:text-white dark:opacity-100 transition-all  px-1.5 rounded-full `}/* color: ${({
    color,
  }) => color} */
`;

const SidebarLink = (props: {
  title: NavigationLinks;
  path: string;
  idx: number;
  isFullWidth: boolean;
}) => {
  const { title, path, idx, isFullWidth: isHoverd } = props;
  const { pathname } = useLocation();

  return (
    <NavLink to={path}>
      <StyledSidebarLinkWrapper isCurrent={path == pathname}>
        <StyledNavLinkIcon color={COLORS[idx]}>
          <NavigationLinkIcon navLink={title} />
        </StyledNavLinkIcon>

        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: isHoverd ? 0 : -10, opacity: isHoverd ? 1 : 0 }}
        >
          {title}
        </motion.div>
      </StyledSidebarLinkWrapper>
    </NavLink>
  );
};

const StyledSpinaIcon = styled.div`
  ${tw`w-5 h-5  hover:scale-100 transition-all  mb-12 ml-2.5 scale-90`}
`;
const StyledSidebarWrapper = styled.div<{ isFullWidth: boolean }>`
  ${tw`h-full  pt-6 bg-white dark:bg-seconderyDark  transition-all  px-2 rounded-xl backdrop-blur-2xl bg-opacity-95  `}
`;

const Sidebar = () => {
  const { isSidebarVisible, toggleSidebar } = useAppState();
  const { width } = useWindowDimensions();
  const [isHoverd, setIsHoverd] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isMobile = width < 768;
  const isVisible = isMobile ? isSidebarVisible : true;
  const isFullWidth = isMobile ? true : isHoverd;

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
      console.log("click outside");
      toggleSidebar();
    }
  };

  return (
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
        <StyledSpinaIcon>
          <ViSpina />
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
        <SettingsLink isFullWidth={isFullWidth} />
      </StyledSidebarWrapper>
    </motion.div>
  );
};

export default Sidebar;
