import styled from "@emotion/styled";
import tw from "twin.macro";
import { useSelectedLanguage } from "../../hooks/useSelectedLanguage";
import {
  displayAlertTexts,
  displayDataTypeTexts,
} from "../../utils/displayText";
import { IoHeadset } from "react-icons/io5";

const StyledPOdcastCellWrapper = styled.div`
  ${tw`pb-4 min-h-48 `}
`;

const StyledPOdcastCellContainer = styled.div`
  ${tw`w-full  space-x-1 cursor-pointer   p-1  items-center  flex  rounded-lg  h-32 transition-all md:hover:scale-105 bg-tertiary dark:bg-tertiaryDark `}
`;

const StyledPOdcastCellItem = styled.div<{ backgroundColor: string }>`
  ${tw`p-2 w-full  pt-4 rounded-md  h-full`}
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const StyledPOdcastCellTitle = styled.p`
  ${tw`mt-2 text-sm   line-clamp-2  dark:text-primaryTextDark `}
`;

const StyledResourceTypeText = styled.p`
  ${tw`text-sm  text-seconderyText dark:text-seconderyTextDark `}
`;

const PodcastThumbNail = (props: {
  color: string;
  title: string;
  onClick?: () => void;
  type?: string;
}) => {
  const { selectedLanguage } = useSelectedLanguage();
  const {
    color,
    title,
    onClick,
    type = displayDataTypeTexts(selectedLanguage).podcast,
  } = props;

  return (
    <StyledPOdcastCellWrapper onClick={onClick}>
      <StyledPOdcastCellContainer>
        <StyledPOdcastCellItem backgroundColor={color}>
          <IoHeadset />
        </StyledPOdcastCellItem>
      </StyledPOdcastCellContainer>

      <StyledPOdcastCellTitle>
        {title || displayAlertTexts(selectedLanguage).noTitle}
      </StyledPOdcastCellTitle>

      <StyledResourceTypeText>{type} </StyledResourceTypeText>
    </StyledPOdcastCellWrapper>
  );
};

export default PodcastThumbNail;
