import styled from '@emotion/styled';
import tw from 'twin.macro';

const StyledDivider = styled.div`
  ${tw`border-t my-4 border-primaryBorder `}
`;
const Divider = () => <StyledDivider />;

export default Divider