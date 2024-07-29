import styled from "@emotion/styled";
import { PropsWithChildren, ReactNode, useState } from "react";
import tw from "twin.macro";
import ActionSheet from "../presentation/ActionSheet";

const StyledNavBarButton = styled.div<{ isPressed: boolean }>`
  ${tw`text-2xl text-primaryColor cursor-pointer transition-all dark:text-primaryTextDark md:hover:opacity-50`}
  ${({ isPressed }) => isPressed && tw`opacity-50`}
`;

interface NavBarButtonProps {
  onClick?: () => void;
  content?: ReactNode;
}

const NavBarButton = (props: PropsWithChildren & NavBarButtonProps) => {
  const { children, onClick, content } = props;
  const [isSheetVisible, setIsSheetVisible] = useState(false);

  const handleClick = () => {
    onClick && onClick();
    if (content) {
      setIsSheetVisible(true);
    }
  };

  return (
    <div>
      <StyledNavBarButton isPressed={isSheetVisible} onClick={handleClick}>
        {children}
      </StyledNavBarButton>
      <ActionSheet
        visible={isSheetVisible}
        navigateBack={() => setIsSheetVisible(false)}
      >
        {content}
      </ActionSheet>
    </div>
  );
};

export default NavBarButton;
