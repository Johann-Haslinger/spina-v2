import styled from "@emotion/styled";
import  { PropsWithChildren } from "react";
import tw from "twin.macro";

const StyledNavBarButton = styled.div`
  ${tw`text-2xl transition-all dark:text-primaryTextDark hover:opacity-50`}
`;

const NavBarButton = (props: PropsWithChildren & { onClick?: ()=> void}) => {
  const { children, onClick } = props;

  return <StyledNavBarButton onClick={onClick}>{children}</StyledNavBarButton>;
};

export default NavBarButton;
