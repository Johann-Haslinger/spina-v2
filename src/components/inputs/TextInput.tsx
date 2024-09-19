import styled from '@emotion/styled';
import tw from 'twin.macro';

const StyledTextInput = styled.input`
  ${tw`w-full bg-[#ffffff00] outline-none placeholder:text-placeholder-text   dark:placeholder:text-placeholder-text-dark dark:text-primary-text-dark `}
`;

export default StyledTextInput;
