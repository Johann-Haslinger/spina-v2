import styled from '@emotion/styled';
import tw from 'twin.macro';
import { useSelectedLanguage } from '../../common/hooks/useSelectedLanguage';
import { displayAlertTexts, displayDataTypeTexts } from '../../common/utilities/displayText';

const StyledNoteCellWrapper = styled.div`
  ${tw`pb-4 min-h-48 `}
`;

const StyledNoteCellContainer = styled.div`
  ${tw`w-full  space-x-1 cursor-pointer   p-1  items-center  flex  rounded-lg  h-32 transition-all md:hover:scale-105 bg-tertiary dark:bg-tertiary-dark `}
`;

const StyledNoteCellItem = styled.div<{ backgroundColor: string }>`
  ${tw`p-2 w-1/2  pt-4 rounded-md  h-full`}
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const StyledNoteCellTitle = styled.p`
  ${tw`mt-2 text-sm   line-clamp-2  dark:text-primary-text-dark `}
`;

const StyledResourceTypeText = styled.p`
  ${tw`text-sm  text-secondary-text dark:text-secondary-text-dark `}
`;

const NoteThumbNail = (props: { color: string; title: string; onClick?: () => void; type?: string }) => {
  const { selectedLanguage } = useSelectedLanguage();
  const { color, title, onClick, type = displayDataTypeTexts(selectedLanguage).note } = props;

  return (
    <StyledNoteCellWrapper onClick={onClick}>
      <StyledNoteCellContainer>
        {[1, 2].map((cellIndex) => (
          <StyledNoteCellItem key={cellIndex} backgroundColor={cellIndex == 2 ? color : color + '99'} />
        ))}
      </StyledNoteCellContainer>

      <StyledNoteCellTitle>{title || displayAlertTexts(selectedLanguage).noTitle}</StyledNoteCellTitle>

      <StyledResourceTypeText>{type} </StyledResourceTypeText>
    </StyledNoteCellWrapper>
  );
};

export default NoteThumbNail;
