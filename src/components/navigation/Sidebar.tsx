import styled from "@emotion/styled";
import { motion } from "framer-motion";
import tw from "twin.macro";
import { COLOR_ITEMS, COLORS, NAV_LINKS } from "../../base/constants";
import NavigationLinkIcon from "./NavigationLinkIcon";
import { NavigationLinks } from "../../base/enums";
import { ViSidebar, ViSidebarDark, ViSpina } from "../../assets/icons";
import { NavLink, useLocation } from "react-router-dom";
import { useAppState } from "../../features/collection/hooks/useAppState";
import { useEffect, useState } from "react";

const StyledSidebarLinkWrapper = styled.div<{ isCurrent: boolean }>`
  ${tw`flex my-3 dark:text-white hover:bg-black overflow-hidden py-1.5 transition-all px-2 rounded-lg space-x-4 items-center`}
  ${({ isCurrent }) => isCurrent && tw``}
`;
const StyledNavLinkText = styled.div<{ isHoverd: boolean }>`
  ${tw`transition-all`}/* ${({ isHoverd }) =>
    isHoverd ? tw` visible` : tw` invisible`} */
`;
const StyledNavLinkIcon = styled.div<{ color: string }>`
  ${tw`text-2xl  px-1.5 rounded-full `}/* color: ${({ color }) => color} */
`;

const SidebarLink = (props: {
  title: NavigationLinks;
  path: string;
  idx: number;
  isHoverd: boolean;
}) => {
  const { title, path, idx, isHoverd } = props;
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

const StyledSidebarIcon = styled.div<{ type: "light" | "dark" }>`
  ${tw` cursor-pointer`}
  ${({ type }) =>
    type === "light"
      ? tw`dark:invisible dark:w-0`
      : tw`dark:visible w-0 dark:w-fit invisible`};
`;

const StyledSpinaIcon = styled.div`
  ${tw`w-5 h-5 mb-12 ml-2 scale-90`}
`;
const StyledSidebarWrapper = styled.div<{ isHoverd: boolean }>`
  ${tw`h-full  pt-6 bg-white dark:bg-[#141414] px-2 rounded-xl backdrop-blur-2xl bg-opacity-90  `}
`;

const Sidebar = () => {
  const { isSidebarVisible, toggleSidebar } = useAppState();
  const [isHoverd, setIsHoverd] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setIsHoverd(true)}
      onHoverEnd={() => setIsHoverd(false)}
      style={{
        position: "fixed",
        height: "96%",
        top: "2%",
        left: "1%",
        zIndex: 1000,
      }}
      initial={{
        width: 72,
        x: -100,
      }}
      animate={{
        width: isHoverd ? 250 : 72,
        x: 0,
      }}
    >
      <StyledSidebarWrapper isHoverd={isHoverd}>
        <StyledSpinaIcon >
          <ViSpina />
        </StyledSpinaIcon>

        {NAV_LINKS.map((navLink, idx) => (
          <SidebarLink
            isHoverd={isHoverd}
            key={idx}
            idx={idx}
            title={navLink.title}
            path={navLink.path}
          />
        ))}
      </StyledSidebarWrapper>
    </motion.div>
  );
};

export default Sidebar;
