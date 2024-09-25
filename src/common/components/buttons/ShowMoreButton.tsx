import styled from '@emotion/styled';
import { IoChevronForward } from 'react-icons/io5';
import tw from 'twin.macro';

const StyledShowMoreButton = styled.div`
  ${tw`text-xl text-secondary-text opacity-70`}
`;

const ShowMoreButton = () => (
  <StyledShowMoreButton>
    <IoChevronForward />
  </StyledShowMoreButton>
);

export default ShowMoreButton;
