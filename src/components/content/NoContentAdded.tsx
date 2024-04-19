import styled from "@emotion/styled";
import React from "react";
import tw from "twin.macro";
import { displayAlertTexts } from "../../utils/selectDisplayText";
import { useSelectedLanguage } from "../../hooks/useSelectedLanguage";

const StyledNoConttentAddedWrapper = styled.div`
  ${tw`mx-auto  mt-40 text-center`}

`;

const StyledNoContentTitle = styled.p<{ color: string, backgroundColor?: string }>`
  ${tw`text-4xl font-black w-fit py-4 px-4 mx-auto`}
  color: ${({ color }) => color};
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const StyledNoContentSubTitle = styled.p<{ color: string, backgroundColor?: string }>`
  ${tw`text-lg text-seconderyText px-2 pb-4 pt-2`}
  color: ${({ color }) => color};

`;

const NoContentAdded = (props: {
  color?: string;
  backgroundColor?: string;
}) => {
  const { color = "black", backgroundColor } = props;
  const {selectedLanguage} = useSelectedLanguage();

  return (
    <StyledNoConttentAddedWrapper>
      <StyledNoContentTitle color={color} backgroundColor={backgroundColor}>
        {displayAlertTexts(selectedLanguage).noContentAddedTitle}
      </StyledNoContentTitle>
      {/* <StyledNoContentSubTitle  color={color} backgroundColor={backgroundColor}>
        {displayAlertTexts(selectedLanguage).noContentAddedSubtitle}
      </StyledNoContentSubTitle> */}
    </StyledNoConttentAddedWrapper>
  );
};

export default NoContentAdded;
