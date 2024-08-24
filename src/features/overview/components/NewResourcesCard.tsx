import styled from '@emotion/styled';
import { IoFileTray } from 'react-icons/io5';
import tw from 'twin.macro';

const StyledCardWrapper = styled.div`
  ${tw`w-full h-[28rem] p-4 text-[#EF9D4A] rounded-2xl bg-[#EF9D4A] bg-opacity-15`}
`;

const StyledFlexContainer = styled.div`
  ${tw`flex space-x-2 md:opacity-80 items-center`}
`;

const StyledText = styled.div`
  ${tw`font-bold text-sm`}
`;

const NewResourcesCard = () => {
  return (
    <StyledCardWrapper>
      <StyledFlexContainer>
        <IoFileTray />
        <StyledText>Neu hinzugefügt</StyledText>
      </StyledFlexContainer>
    </StyledCardWrapper>
  );
};

export default NewResourcesCard;
