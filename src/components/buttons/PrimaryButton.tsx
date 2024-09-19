import styled from '@emotion/styled/macro';
import tw from 'twin.macro';

const PrimaryButton = styled.button`
  ${tw`text-primary-color font-bold  dark:text-primary-text-dark  md:hover:opacity-50 transition-all `}
`;

export default PrimaryButton;
