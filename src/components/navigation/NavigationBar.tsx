import styled from "@emotion/styled";
import React, { PropsWithChildren } from "react";
import tw from "twin.macro";
import { ViSidebar } from "../../assets/icons";
import { IoArrowBack, IoChevronBack } from "react-icons/io5";

const StyledNavBarWrapper = styled.div`
  ${tw`flex fixed px-6 pt-2 top-0    left-0 w-full justify-between   h-14 `}
`;

const NavigationIconWrapper = styled.div`
  ${tw`flex items-center`}
`;

const ToolIconWrapper = styled.div`
  ${tw`flex pr-4 text-xl items-center`}
`;

const StyledBackButton = styled.button`
  ${tw`flex space-x-2 ml-4 items-center`}
`;

const StyledBackButtonIcon = styled.div`
  ${tw`text-xl `}
`;

const StyledBackButtonText = styled.p`
  ${tw`text-sm`}
`;

const NavigationBar = (
  props: PropsWithChildren & { navigateBack?: () => void, backButtonLabel?: string }
) => {
  const { navigateBack, children, backButtonLabel } = props;

  return (
    <StyledNavBarWrapper>
      <NavigationIconWrapper>
        <ViSidebar />
        {navigateBack && (
          <StyledBackButton onClick={navigateBack}>
            <StyledBackButtonIcon>
              <IoChevronBack />
            </StyledBackButtonIcon>
            <StyledBackButtonText>{backButtonLabel ? backButtonLabel : "Sammlung"}</StyledBackButtonText>
          </StyledBackButton>
        )}
      </NavigationIconWrapper>
      <ToolIconWrapper>{children}</ToolIconWrapper>
    </StyledNavBarWrapper>
  );
};

export default NavigationBar;
