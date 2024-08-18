import styled from '@emotion/styled';
import { PropsWithChildren } from 'react';
import tw from 'twin.macro';
import { ViSidebar, ViSidebarDark } from '../../assets/icons';
import { useAppState } from '../../features/collection/hooks/useAppState';

const StyledNavBarWrapper = styled.div`
  ${tw`flex fixed px-4 md:!bg-opacity-0  bg-primary dark:bg-primaryDark md:dark:bg-opacity-0   z-[100] transition-all    md:px-6 items-center top-0 dark:text-white text-primatyText left-0 w-full justify-between   h-14 `}
`;

const ToolIconWrapper = styled.div`
  ${tw`flex h-fit space-x-4 lg:space-x-8 items-center`}
`;

const StyledSidebarIcon = styled.div<{ type: 'light' | 'dark' }>`
  ${tw`text-xl md:flex hidden h-fit`}
  ${({ type }) => (type === 'light' ? tw`dark:invisible dark:w-0` : tw`dark:visible w-0 dark:w-fit invisible`)};
`;

const StyledLeftSideWrapper = styled.div`
  ${tw`items-center flex`}
`;

const NavigationBar = (props: PropsWithChildren) => {
  const { children } = props;
  const { toggleSidebar } = useAppState();

  return (
    <StyledNavBarWrapper>
      <StyledLeftSideWrapper>
        <StyledSidebarIcon onClick={toggleSidebar} type="light">
          <ViSidebar />
        </StyledSidebarIcon>
        <StyledSidebarIcon onClick={toggleSidebar} type="dark">
          <ViSidebarDark />
        </StyledSidebarIcon>
      </StyledLeftSideWrapper>

      <ToolIconWrapper>{children}</ToolIconWrapper>
    </StyledNavBarWrapper>
  );
};

export default NavigationBar;
