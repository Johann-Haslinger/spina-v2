import styled from '@emotion/styled';
import tw from 'twin.macro';

const StyledDivider = styled.div`
  ${tw`border-t border-opacity-0 md:border-opacity-100 my-2 md:my-4 dark:border-white border-primaryBorder `}
`;
const Divider = () => <StyledDivider />;

export default Divider