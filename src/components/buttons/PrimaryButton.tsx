import styled from '@emotion/styled/macro';
import tw from 'twin.macro';

const PrimaryButton = styled.button`
  ${tw`text-primaryColor font-bold  dark:text-primaryTextDark  md:hover:opacity-50 transition-all `}
`;

export default PrimaryButton;
