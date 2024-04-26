import React from "react";
import styled from "@emotion/styled";
import { PropsWithChildren, ReactNode, useState } from "react";
import tw from "twin.macro";
import OptionSheet from "../presentation/OptionSheet";

const StyledNavBarButton = styled.div`
  ${tw`text-2xl transition-all dark:text-primaryTextDark hover:opacity-50`}
`;

interface NavBarButtonProps {
  onClick?: () => void
content?: ReactNode
}


const NavBarButton = (props: PropsWithChildren & NavBarButtonProps) => {
  const { children, onClick, content } = props;
  const [isSheetVisible, setIsSheetVisible] = useState(false);

  const handleClick = () => {
    onClick && onClick();
    if (content) {
      setIsSheetVisible(true);
    } 
  }

  return (
    <>
      <StyledNavBarButton onClick={handleClick}>{children}</StyledNavBarButton>
      <OptionSheet visible={isSheetVisible} navigateBack={() => setIsSheetVisible(false)}>
        {content}
      </OptionSheet>
    </>
  );
};

export default NavBarButton;
