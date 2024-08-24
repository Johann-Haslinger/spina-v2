import styled from '@emotion/styled';
import { IoBook } from 'react-icons/io5';
import tw from 'twin.macro';
import { useSelectedLanguage } from '../../hooks/useSelectedLanguage';
import { displayAlertTexts, displayDataTypeTexts } from '../../utils/displayText';

const StyledTopictCellWrapper = styled.div`
  ${tw`pb-4 min-h-40 w-36`}
`;

const StyledTopictCellContainer = styled.div`
  ${tw`w-full  space-x-1 cursor-pointer   p-1  items-center  flex  rounded-lg  h-24 transition-all md:hover:scale-105 bg-tertiary dark:bg-tertiaryDark `}
`;

const StyledTopictCellItem = styled.div<{ backgroundColor: string }>`
  ${tw`p-2 w-full text-4xl  flex justify-center items-center rounded-md  h-full`}
  background-color: ${({ backgroundColor }) => backgroundColor + '60'};
  color: ${({ backgroundColor }) => backgroundColor};
`;

const StyledTopictCellTitle = styled.p`
  ${tw`mt-2 text-sm w-full    line-clamp-2  dark:text-primaryTextDark `}
`;

const StyledResourceTypeText = styled.p`
  ${tw`text-sm  text-seconderyText dark:text-seconderyTextDark `}
`;

const TopicResoucreThumbNail = (props: { color: string; title: string; onClick?: () => void; type?: string }) => {
  const { selectedLanguage } = useSelectedLanguage();
  const { color, title, onClick, type = displayDataTypeTexts(selectedLanguage).topic } = props;

  return (
    <StyledTopictCellWrapper onClick={onClick}>
      <StyledTopictCellContainer>
        <StyledTopictCellItem backgroundColor={color}>
          <IoBook />
        </StyledTopictCellItem>
      </StyledTopictCellContainer>

      <StyledTopictCellTitle>{title || displayAlertTexts(selectedLanguage).noTitle}</StyledTopictCellTitle>

      <StyledResourceTypeText>{type} </StyledResourceTypeText>
    </StyledTopictCellWrapper>
  );
};

export default TopicResoucreThumbNail;
