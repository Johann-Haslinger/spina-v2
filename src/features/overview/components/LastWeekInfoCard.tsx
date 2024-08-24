import styled from '@emotion/styled';
import { IoStatsChart } from 'react-icons/io5';
import tw from 'twin.macro';

const StyledCardWrapper = styled.div`
  ${tw`w-full h-[24rem] p-4 text-[#E76542] rounded-2xl bg-[#E76542] bg-opacity-15`}
`;

const StyledFlexContainer = styled.div`
  ${tw`flex space-x-2 md:opacity-80 items-center`}
`;

const StyledText = styled.div`
  ${tw`font-bold text-sm`}
`;

const LastWeekInfoCard = () => {
  return (
    <StyledCardWrapper>
      <StyledFlexContainer>
        <IoStatsChart tw="rotate-90" />
        <StyledText>Letzte 7 Tage</StyledText>
      </StyledFlexContainer>
    </StyledCardWrapper>
  );
};

export default LastWeekInfoCard;
