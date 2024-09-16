import styled from '@emotion/styled';
import { Fragment, PropsWithChildren } from 'react';
import tw from 'twin.macro';
import { ViSidebar, ViSidebarDark } from '../../assets/icons';
import { useAppState } from '../../features/collection/hooks/useAppState';

const StyledNavBarWrapper = styled.div`
  ${tw`flex fixed px-4 md:!bg-opacity-0  bg-primary dark:bg-primaryDark md:dark:bg-opacity-0    transition-all    md:px-6 items-center top-0 dark:text-white text-primatyText left-0 w-full justify-between   h-14 `}
`;

const ToolIconWrapper = styled.div`
  ${tw`flex h-fit space-x-4 lg:space-x-8 items-center`}
`;

const StyledSidebarIcon = styled.div<{ type: 'light' | 'dark' | 'always' }>`
  ${tw`text-xl relative top-0.5 md:flex hidden h-fit`}
  ${({ type }) =>
    type === 'light' ? tw`dark:invisible dark:w-0` : type == 'dark' ? tw`dark:visible w-0 dark:w-fit invisible` : null};
`;

const StyledLeftSideWrapper = styled.div`
  ${tw`items-center flex`}
`;
interface NavBarProps extends PropsWithChildren {
  white?: boolean;
}

const NavigationBar = (props: NavBarProps) => {
  const { children, white } = props;
  const { toggleSidebar } = useAppState();

  return (
    <StyledNavBarWrapper>
      <StyledLeftSideWrapper>
        {!white ? (
          <Fragment>
            <StyledSidebarIcon onClick={toggleSidebar} type="light">
              <ViSidebar />
            </StyledSidebarIcon>
            <StyledSidebarIcon onClick={toggleSidebar} type="dark">
              <ViSidebarDark />
            </StyledSidebarIcon>
          </Fragment>
        ) : (
          <StyledSidebarIcon onClick={toggleSidebar} type="always">
            <ViSidebarDark />
          </StyledSidebarIcon>
        )}
      </StyledLeftSideWrapper>

      <ToolIconWrapper>{children}</ToolIconWrapper>
    </StyledNavBarWrapper>
  );
};

export default NavigationBar;
