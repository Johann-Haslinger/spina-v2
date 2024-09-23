import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Fragment, PropsWithChildren, useContext } from 'react';
import { IoPersonCircle } from 'react-icons/io5';
import tw from 'twin.macro';
import { ViSidebar, ViSidebarDark } from '../../assets/icons';
import { Story } from '../../base/enums';
import { useAppState } from '../../features/collection/hooks/useAppState';
import { useUserData } from '../../hooks/useUserData';
import { useWindowDimensions } from '../../hooks/useWindowDimensions';

const StyledNavBarWrapper = styled.div`
  ${tw`flex fixed px-4 md:!bg-opacity-0  bg-primary dark:bg-primary-dark md:dark:bg-opacity-0   z-[100] transition-all    md:px-6 items-center top-0 dark:text-white text-primary-text left-0 w-full justify-between   h-14 `}
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
  const { isMobile } = useWindowDimensions();

  return (
    <StyledNavBarWrapper>
      {!isMobile && (
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
      )}

      <ToolIconWrapper>{children}</ToolIconWrapper>
      {isMobile && <ProfileButton />}
    </StyledNavBarWrapper>
  );
};

export default NavigationBar;

const ProfileButton = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { profilePicture } = useUserData();

  const openSettings = () => lsc.stories.transitTo(Story.OBSERVING_SETTINGS_STORY);

  return !profilePicture ? (
    <div onClick={openSettings} tw="text-4xl text-secondary-text dark:text-secondary-text-dark">
      <IoPersonCircle />
    </div>
  ) : (
    <div
      style={{
        backgroundImage: `url(${profilePicture})`,
      }}
      onClick={openSettings}
      tw="size-8 bg-cover dark:bg-white rounded-full bg-black"
    />
  );
};
