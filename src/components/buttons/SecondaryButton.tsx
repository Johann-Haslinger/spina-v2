import styled from '@emotion/styled/macro';
import tw from 'twin.macro';

const SecondaryButton = styled.button`
  ${tw`text-primaryColor dark:text-primaryTextDark  md:hover:opacity-50 transition-all`}
`;

export default SecondaryButton;
