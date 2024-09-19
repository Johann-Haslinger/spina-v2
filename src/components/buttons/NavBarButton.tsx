import styled from '@emotion/styled';
import { PropsWithChildren, ReactNode, useState } from 'react';
import tw from 'twin.macro';
import ActionSheet from '../presentation/ActionSheet';

const StyledNavBarButton = styled.div<{ isPressed: boolean; blocked: boolean }>`
  ${tw`text-2xl  transition-all `}
  ${({ isPressed }) => isPressed && tw`opacity-50`}
  ${({ blocked }) =>
    blocked
      ? tw` text-secondary-text dark:text-secondary-text-dark cursor-not-allowed`
      : tw`md:hover:opacity-50 text-primary-color dark:text-primary-text-dark cursor-pointer `}
`;

interface NavBarButtonProps {
  onClick?: () => void;
  content?: ReactNode;
  blocked?: boolean;
}

const NavBarButton = (props: PropsWithChildren & NavBarButtonProps) => {
  const { children, onClick, content, blocked = false } = props;
  const [isSheetVisible, setIsSheetVisible] = useState(false);

  const handleClick = () => {
    if (blocked) return;

    onClick && onClick();
    if (content) {
      setIsSheetVisible(true);
    }
  };

  return (
    <div>
      <StyledNavBarButton blocked={blocked} isPressed={isSheetVisible} onClick={handleClick}>
        {children}
      </StyledNavBarButton>
      <ActionSheet visible={isSheetVisible} navigateBack={() => setIsSheetVisible(false)}>
        {content}
      </ActionSheet>
    </div>
  );
};

export default NavBarButton;
