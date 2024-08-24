import styled from '@emotion/styled';
import tw from 'twin.macro';
import { useSelectedLanguage } from '../../hooks/useSelectedLanguage';
import { displayAlertTexts, displayDataTypeTexts } from '../../utils/displayText';

const StyledNoteCellWrapper = styled.div`
  ${tw`pb-4 min-h-48 `}
`;

const StyledNoteCellContainer = styled.div`
  ${tw`w-full  space-x-1 cursor-pointer   p-1  items-center  flex  rounded-lg  h-32 transition-all md:hover:scale-105 bg-tertiary dark:bg-tertiaryDark `}
`;

const StyledNoteCellItem = styled.div<{ backgroundColor: string }>`
  ${tw`p-2 w-1/2  pt-4 rounded-md  h-full`}
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const StyledNoteCellItem2 = styled.div<{ backgroundColor: string }>`
  ${tw`p-2 w-full  pt-4 rounded-md  h-1/4`}
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const StyledNoteCellItem3 = styled.div<{ backgroundColor: string }>`
  ${tw`p-2 w-full  pt-4 rounded-md  h-[71%]`}
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const StyledNoteCellTitle = styled.p`
  ${tw`mt-2 text-sm   line-clamp-2  dark:text-primaryTextDark `}
`;

const StyledResourceTypeText = styled.p`
  ${tw`text-sm  text-seconderyText dark:text-seconderyTextDark `}
`;

const StyledLeftSideWrapper = styled.div`
  ${tw`w-1/2 space-y-1 h-full`}
`;

const ExerciseThumbnail = (props: { color: string; title: string; onClick?: () => void }) => {
  const { selectedLanguage } = useSelectedLanguage();
  const { color, title, onClick } = props;

  return (
    <StyledNoteCellWrapper onClick={onClick}>
      <StyledNoteCellContainer>
        <StyledLeftSideWrapper>
          <StyledNoteCellItem2 backgroundColor={color} />
          <StyledNoteCellItem3 backgroundColor={color + '99'} />
        </StyledLeftSideWrapper>
        <StyledNoteCellItem backgroundColor={color + '99'} />
      </StyledNoteCellContainer>

      <StyledNoteCellTitle>{title || displayAlertTexts(selectedLanguage).noTitle}</StyledNoteCellTitle>

      <StyledResourceTypeText>{displayDataTypeTexts(selectedLanguage).exercise} </StyledResourceTypeText>
    </StyledNoteCellWrapper>
  );
};

export default ExerciseThumbnail;
