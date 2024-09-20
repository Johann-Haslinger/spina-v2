import styled from '@emotion/styled';
import tw from 'twin.macro';

const ScrollableBox = styled.div`
  ${tw`overflow-y-scroll rounded-xl pb-80 w-full h-full`}
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export default ScrollableBox;
