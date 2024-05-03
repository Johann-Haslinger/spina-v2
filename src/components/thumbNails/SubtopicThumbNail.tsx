import styled from "@emotion/styled";
import tw from "twin.macro";
import { useSelectedLanguage } from "../../hooks/useSelectedLanguage";
import { displayAlertTexts, displayDataTypeTexts } from "../../utils/displayText";

const StyledSubtopicCellWrapper = styled.div`
  ${tw`pb-4 min-h-48 `}
`;

const StyledSubtopicCellContainer = styled.div`
  ${tw`w-full  cursor-pointer  space-x-1   p-1  items-center  flex  rounded-lg  h-32 transition-all md:hover:scale-105 bg-tertiary dark:bg-tertiaryDark `}
`;

const StyledSubtopicCellItem = styled.div<{ backgroundColor: string }>`
  ${tw`p-2 w-1/2  pt-4 rounded-md  h-full`}
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const StyledSubtopicCellTitle = styled.p`
  ${tw`mt-2 text-sm   line-clamp-2  dark:text-primaryTextDark `}
`;

const StyledResourceTypeText = styled.p`
  ${tw`text-sm  text-seconderyText dark:text-seconderyTextDark `}
`;

const CardWrapper = tw.div`
w-1/2   space-y-1
`;

const StyledCardContent = styled.div<{ color: string }>`
  ${tw`  pb-3.5 px-2 pt-1.5 w-full h-[58px] rounded-md`}
  background-color: ${({ color }) => color};
`;

const SubtopicThumbNail = (props: {
  color: string;
  title: string;
  onClick?: () => void;
  type?: string;
}) => {
  const { selectedLanguage } = useSelectedLanguage();
  const { color, title, onClick, type = displayDataTypeTexts(selectedLanguage).subTopic } = props;

  return (
    <StyledSubtopicCellWrapper onClick={onClick}>
      <StyledSubtopicCellContainer>
        <StyledSubtopicCellItem backgroundColor={color} />
        <CardWrapper>
          {Array.from({ length: 2 }, (_, index) => index + 1).map((_, idx) => (
            <StyledCardContent key={idx} color={color} />
          ))}
        </CardWrapper>
      </StyledSubtopicCellContainer>

      <StyledSubtopicCellTitle>{title || displayAlertTexts(selectedLanguage).noTitle}</StyledSubtopicCellTitle>

      <StyledResourceTypeText>{type} </StyledResourceTypeText>
    </StyledSubtopicCellWrapper>
  );
};

export default SubtopicThumbNail;
