import styled from '@emotion/styled';
import { IoPlay } from 'react-icons/io5';
import tw from 'twin.macro';

const StyledCardWrapper = styled.div`
  ${tw`w-full h-[12rem] p-4 text-[#397A45] rounded-2xl bg-[#397A45] bg-opacity-15`}
`;

const StyledFlexContainer = styled.div`
  ${tw`flex space-x-2 md:opacity-80 items-center`}
`;

const StyledText = styled.div`
  ${tw`font-bold text-sm`}
`;

const StartFlashcardSessionCard = () => {
  return (
    <StyledCardWrapper>
      <StyledFlexContainer>
        <IoPlay />
        <StyledText>Starte eine Abfragerunde</StyledText>
      </StyledFlexContainer>
    </StyledCardWrapper>
  );
};

export default StartFlashcardSessionCard;
