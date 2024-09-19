import styled from '@emotion/styled';
import { IoHeadset } from 'react-icons/io5';
import tw from 'twin.macro';
import { useSelectedLanguage } from '../../hooks/useSelectedLanguage';
import { displayAlertTexts, displayDataTypeTexts } from '../../utils/displayText';

const StyledPOdcastCellWrapper = styled.div`
  ${tw`pb-4 min-h-48 `}
`;

const StyledPOdcastCellContainer = styled.div`
  ${tw`w-full  space-x-1 cursor-pointer   p-1  items-center  flex  rounded-lg  h-32 transition-all md:hover:scale-105 bg-tertiary dark:bg-tertiary-dark `}
`;

const StyledPOdcastCellItem = styled.div<{ backgroundColor: string }>`
  ${tw`p-2 w-full  pt-4 rounded-md  h-full`}
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const StyledPOdcastCellTitle = styled.p`
  ${tw`mt-2 text-sm   line-clamp-2  dark:text-primary-text-dark `}
`;

const StyledResourceTypeText = styled.p`
  ${tw`text-sm  text-secondary-text dark:text-secondary-text-dark `}
`;

const PodcastThumbNail = (props: { color: string; title: string; onClick?: () => void; type?: string }) => {
  const { selectedLanguage } = useSelectedLanguage();
  const { color, title, onClick, type = displayDataTypeTexts(selectedLanguage).podcast } = props;

  return (
    <StyledPOdcastCellWrapper onClick={onClick}>
      <StyledPOdcastCellContainer>
        <StyledPOdcastCellItem backgroundColor={color}>
          <IoHeadset />
        </StyledPOdcastCellItem>
      </StyledPOdcastCellContainer>

      <StyledPOdcastCellTitle>{title || displayAlertTexts(selectedLanguage).noTitle}</StyledPOdcastCellTitle>

      <StyledResourceTypeText>{type} </StyledResourceTypeText>
    </StyledPOdcastCellWrapper>
  );
};

export default PodcastThumbNail;
