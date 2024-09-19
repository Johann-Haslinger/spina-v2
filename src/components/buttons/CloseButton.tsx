import styled from '@emotion/styled';
import { IoClose } from 'react-icons/io5';
import tw from 'twin.macro';

const StyledCloseButtonWrapper = styled.div`
  ${tw`p-1 mt-1 transition-all md:hover:opacity-50 relative left-2 dark:bg-tertiary-dark dark:text-secondary-text-dark bg-tertiary rounded-full text-lg text-secondary-text-dark`}
`;

const CloseButton = (props: { onClick: () => void }) => {
  return (
    <StyledCloseButtonWrapper onClick={props.onClick}>
      <IoClose />
    </StyledCloseButtonWrapper>
  );
};

export default CloseButton;
