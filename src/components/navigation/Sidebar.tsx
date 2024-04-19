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

const StyledSettingsWrapper = styled.div<{ isHoverd: boolean }>`
  ${tw`flex w-[226px] cursor-pointer  hover:bg-primary dark:hover:bg-black   mx-1 absolute bottom-0 my-2 dark:text-white  overflow-hidden py-1 transition-all  rounded-xl space-x-4 items-center`}/* ${({
    isHoverd,
  }) => isHoverd && tw`bg-secondery dark:bg-black`} */
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
  const { isFullWidth: isHoverd } = props;
  const { color, backgroundColor } = COLOR_ITEMS[1];
  const {toggleSettings} = useAppState();
  
  return (
    <StyledSettingsWrapper onClick={toggleSettings} isHoverd={isHoverd}>
      <StyledProfileIcon color={color} backgroundColor={backgroundColor}>
        J
      </StyledProfileIcon>
      <motion.div
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: isHoverd ? 0 : -10, opacity: isHoverd ? 1 : 0 }}
      >
        <StyledProfileText>Johann</StyledProfileText>
      </motion.div>
    </StyledSettingsWrapper>
  );
};

const StyledSidebarLinkWrapper = styled.div<{ isCurrent: boolean }>`
  ${tw`flex my-1.5 dark:text-white hover:bg-secondery dark:hover:bg-black overflow-hidden py-3 transition-all px-2 rounded-lg space-x-4 items-center`}
  ${({ isCurrent }) => isCurrent && tw``}
`;
const StyledNavLinkIcon = styled.div<{ color: string }>`
  ${tw`text-2xl dark:opacity-100  transition-all  px-1.5 rounded-full `}/* color: ${({
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
  ${tw`h-full  pt-6 bg-white dark:bg-seconderyDark  transition-all  px-2 rounded-xl backdrop-blur-2xl bg-opacity-90  `}
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
        top: isMobile ? "1%" :  "2%",
        left:  isMobile ? "14px" : "1%",
       
      }}
      initial={{
        width: 72,
        x: -100,
      }}
      transition={{ duration: isMobile ?  0.2 : 0.6, type: isMobile ? "tween" :  "spring"}}
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
