import styled from "@emotion/styled";
import { PropsWithChildren } from "react";
import tw from "twin.macro";
import { useAppState } from "../../features/collection/hooks/useAppState";
import { ViSidebar, ViSidebarDark } from "../../assets/icons";

const StyledNavBarWrapper = styled.div`
  ${tw`flex fixed px-4 md:!bg-opacity-0  bg-primary dark:bg-primaryDark md:dark:bg-opacity-0   z-[100] transition-all    md:px-6 pt-4 top-0 dark:text-white text-primatyText left-0 w-full justify-between   h-14 `}
`;

const NavigationIconsWrapper = styled.div`
  ${tw`flex mr-6 items-center`}
`;

const ToolIconWrapper = styled.div`
  ${tw`flex pr-4  space-x-4 lg:space-x-8 items-center`}
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

const NavigationBar = (props: PropsWithChildren) => {
  const { children } = props;
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
      </StyledLeftSideWrapper>

      <ToolIconWrapper>{children}</ToolIconWrapper>
    </StyledNavBarWrapper>
  );
};

export default NavigationBar;
