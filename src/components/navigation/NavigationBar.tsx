import styled from "@emotion/styled";
import React, { PropsWithChildren } from "react";
import tw from "twin.macro";
import { useAppState } from "../../features/collection/hooks/useAppState";
import { ViSidebar, ViSidebarDark } from "../../assets/icons";
import BackButton from "../buttons/BackButton";

const StyledNavBarWrapper = styled.div`
  ${tw`flex fixed px-4  z-[100]  bg-gradient-to-b from-[#F5F5F5]  to-[#f5f5f5d4] transition-all  backdrop-blur-2xl  md:px-6 pt-4 top-0 dark:text-white text-primatyText dark:bg-primaryDark    left-0 w-full justify-between   h-14 `}
`;

const NavigationIconsWrapper = styled.div`
  ${tw`flex items-center`}
`;

const ToolIconWrapper = styled.div`
  ${tw`flex pr-4  space-x-4 lg:space-x-6 items-center`}
`;

const StyledSidebarIcon = styled.div<{ type: "light" | "dark" }>`
  ${tw`text-xl xl:!invisible `}
  ${({ type }) =>
    type === "light"
      ? tw`dark:invisible dark:w-0`
      : tw`dark:visible w-0 dark:w-fit invisible`};
`;

const StyledLeftSideWrapper = styled.div`
  ${tw`flex xl:pl-14 items-center`}
`;

interface NavigationBarProps {
  backButtonLabel?: string;
  navigateBack?: () => void;
}

const NavigationBar = (props: PropsWithChildren & NavigationBarProps) => {
  const { children, backButtonLabel, navigateBack } = props;
  const { toggleSidebar } = useAppState();

  return (
    <StyledNavBarWrapper>
      <StyledLeftSideWrapper>
        <NavigationIconsWrapper>
          <StyledSidebarIcon onClick={toggleSidebar} type="light">
            <ViSidebar />
          </StyledSidebarIcon>
          <StyledSidebarIcon onClick={toggleSidebar} type="dark">
            <ViSidebarDark />
          </StyledSidebarIcon>
        </NavigationIconsWrapper>
        {navigateBack && (
          <BackButton navigateBack={navigateBack}>{backButtonLabel}</BackButton>
        )}
      </StyledLeftSideWrapper>

      <ToolIconWrapper>{children}</ToolIconWrapper>
    </StyledNavBarWrapper>
  );
};

export default NavigationBar;
