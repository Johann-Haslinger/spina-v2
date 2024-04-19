import styled from "@emotion/styled";
import React, { PropsWithChildren } from "react";
import tw from "twin.macro";
import { useAppState } from "../../features/collection/hooks/useAppState";
import { ViSidebar, ViSidebarDark } from "../../assets/icons";

const StyledNavBarWrapper = styled.div`
  ${tw`flex fixed px-4 !bg-opacity-70  transition-all  backdrop-blur-2xl  md:px-6 pt-2 top-0 dark:text-white text-primatyText dark:bg-primaryDark bg-primary   left-0 w-full justify-between   h-14 `}
`;

const NavigationIconsWrapper = styled.div`
  ${tw`flex items-center`}
`;

const ToolIconWrapper = styled.div`
  ${tw`flex pr-4 text-xl items-center`}
`;

const StyledBackButton = styled.button`
  ${tw`flex space-x-2 ml-2 md:ml-4 items-center`}
`;

const StyledBackButtonIcon = styled.div`
  ${tw`text-xl  `}
`;

const StyledBackButtonText = styled.p`
  ${tw`text-sm`}
`;

const StyledSidebarIcon = styled.div<{ type: "light" | "dark" }>`
  ${tw`text-xl md:!invisible `}
  ${({ type }) =>
    type === "light"
      ? tw`dark:invisible dark:w-0`
      : tw`dark:visible w-0 dark:w-fit invisible`};
`;

const NavigationBar = (
  props: PropsWithChildren & {
    navigateBack?: () => void;
    backButtonLabel?: string;
  }
) => {
  const { navigateBack, children, backButtonLabel } = props;
  const { toggleSidebar } = useAppState();

  return (
    <StyledNavBarWrapper>
      <NavigationIconsWrapper>
        <StyledSidebarIcon onClick={toggleSidebar} type="light">
          <ViSidebar />
        </StyledSidebarIcon>
        <StyledSidebarIcon  onClick={toggleSidebar}  type="dark">
          <ViSidebarDark />
        </StyledSidebarIcon>
        {/* {navigateBack && (
          <StyledBackButton onClick={navigateBack}>
            <StyledBackButtonIcon>
              <IoChevronBack />
            </StyledBackButtonIcon>
            <StyledBackButtonText>
              {backButtonLabel ? backButtonLabel : "Sammlung"}
            </StyledBackButtonText>
          </StyledBackButton>
        )}{" "} */}
      </NavigationIconsWrapper>
      <div></div>

      <ToolIconWrapper>{children}</ToolIconWrapper>
    </StyledNavBarWrapper>
  );
};

export default NavigationBar;
