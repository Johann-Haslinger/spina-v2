import styled from '@emotion/styled';
import { IoReader } from 'react-icons/io5';
import tw from 'twin.macro';

const StyledCardWrapper = styled.div`
  ${tw`w-full h-[28rem] p-4 text-[#668FE8] rounded-2xl bg-[#668FE8] bg-opacity-15`}
`;

const StyledFlexContainer = styled.div`
  ${tw`flex space-x-2 md:opacity-80 items-center`}
`;

const StyledText = styled.div`
  ${tw`font-bold text-sm`}
`;

const ExploreCard = () => {
  return (
    <StyledCardWrapper>
      <StyledFlexContainer>
        <IoReader />
        <StyledText>Entdecke etwas Neues</StyledText>
      </StyledFlexContainer>
    </StyledCardWrapper>
  );
};

export default ExploreCard;
