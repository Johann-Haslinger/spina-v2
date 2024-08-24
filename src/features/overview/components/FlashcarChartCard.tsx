import styled from '@emotion/styled';
import { IoBarChart } from 'react-icons/io5';
import tw from 'twin.macro';

const StyledCardWrapper = styled.div`
  ${tw`w-full h-[28rem] p-4 text-[#6EBED9] rounded-2xl bg-[#6EBED9] bg-opacity-15`}
`;

const StyledFlexContainer = styled.div`
  ${tw`flex space-x-2 md:opacity-80 items-center`}
`;

const StyledText = styled.div`
  ${tw`font-bold text-sm`}
`;

const FlashcardChartCard = () => {
  return (
    <StyledCardWrapper>
      <StyledFlexContainer>
        <IoBarChart />
        <StyledText>Abgefragte Lernkarten</StyledText>
      </StyledFlexContainer>
    </StyledCardWrapper>
  );
};

export default FlashcardChartCard;
