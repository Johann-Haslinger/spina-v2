import styled from "@emotion/styled";
import { motion } from "framer-motion";
import tw from "twin.macro";
import { COLOR_ITEMS, NAV_LINKS } from "../../base/constants";
import NavigationLinkIcon from "./NavigationLinkIcon";
import { NavigationLinks } from "../../base/enums";
import { ViSidebar } from "../../assets/icons";
import { NavLink, useLocation } from "react-router-dom";

const StyledSidebarLinkWrapper = styled.div<{ isCurrent: boolean }>`
  ${tw`flex my-1 py-1 rounded-lg space-x-4 items-center`}
  ${({ isCurrent }) => isCurrent && tw`bg-secondery`}
`;
const StyledNavLinkText = styled.div`
  ${tw`text-lg `}
`;
const StyledNavLinkIcon = styled.div<{}>`
  ${tw`text-lg  rounded-full `}
`;

const SidebarLink = (props: {
  title: NavigationLinks;
  path: string;
  idx: number;
}) => {
  const { title, path, idx } = props;
  const { pathname } = useLocation();

  return (
    <NavLink to={path}>
      <StyledSidebarLinkWrapper isCurrent={path == pathname}>
        <StyledNavLinkIcon>
          <NavigationLinkIcon navLink={title} />
        </StyledNavLinkIcon>

        <StyledNavLinkText>{title}</StyledNavLinkText>
      </StyledSidebarLinkWrapper>
    </NavLink>
  );
};

const StyledSidebarWrapper = styled.div`
  ${tw`h-screen fixed pt-4  px-4   top-0 backdrop-blur-2xl bg-opacity-90  w-72 bg-white `}
`;

const StyledSidebarHeader = styled.div`
  ${tw`font-semibold text-3xl mt-5`}
`;

const StyledNavLinksWrapper = styled.div`
  ${tw`mt-4`}
`;

const Sidebar = () => {
  return (
    <StyledSidebarWrapper>
      <ViSidebar />
      {/* <StyledSidebarHeader>Spina</StyledSidebarHeader> */}
      <StyledNavLinksWrapper>
        {NAV_LINKS.map((navLink, idx) => (
          <SidebarLink
            key={idx}
            idx={idx}
            title={navLink.title}
            path={navLink.path}
          />
        ))}
      </StyledNavLinksWrapper>
    </StyledSidebarWrapper>
  );
};

export default Sidebar;
