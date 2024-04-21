import styled from "@emotion/styled";
import React, { PropsWithChildren } from "react";
import tw from "twin.macro";

const StyledSectionRowWrapper = styled.div<{ hideBorder?: boolean }>`
  ${tw`flex items-center w-full h-16 px-1`}
  ${({ hideBorder }) =>
    !hideBorder &&
    tw`border-b dark:border-primaryBorderDark border-primaryBorder`}
`;
interface SectionRowProps {
  hideBorder?: boolean;
}
const SectionRow = (props: PropsWithChildren & SectionRowProps) => {
  const { children, hideBorder } = props;

  return (
    <StyledSectionRowWrapper hideBorder={hideBorder}>
      {children}
    </StyledSectionRowWrapper>
  );
};

export default SectionRow;
