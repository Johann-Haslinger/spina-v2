import styled from "@emotion/styled";
import tw from "twin.macro";
import { displayAlertTexts } from "../../utils/displayText";
import { useSelectedLanguage } from "../../hooks/useSelectedLanguage";

const StyledNoConttentAddedWrapper = styled.div`
  ${tw`mx-auto  mt-32 text-center`}
`;

const StyledNoContentTitle = styled.p`
  ${tw`text-xl text-primatyText dark:text-primaryTextDark font-bold w-fit py-1 px-4 mx-auto`}
`;

const StyledNoContentSubTitle = styled.p`
  ${tw` text-seconderyText dark:text-seconderyTextDark px-2 pb-4 `}
`;

const NoContentAddedHint = () => {
  const { selectedLanguage } = useSelectedLanguage();

  return (
    <StyledNoConttentAddedWrapper>
      <StyledNoContentTitle>
        {displayAlertTexts(selectedLanguage).noContentAddedTitle}
      </StyledNoContentTitle>
      <StyledNoContentSubTitle>
        {displayAlertTexts(selectedLanguage).noContentAddedSubtitle}
      </StyledNoContentSubTitle>
    </StyledNoConttentAddedWrapper>
  );
};

export default NoContentAddedHint;
