import styled from "@emotion/styled";
import { IoClose } from "react-icons/io5";
import tw from "twin.macro";

const StyledCloseButtonWrapper = styled.div`
  ${tw`p-1 transition-all md:hover:opacity-50 relative left-2 dark:bg-tertiaryDark dark:text-seconderyTextDark bg-tertiary rounded-full text-lg text-seconderyTextDark`}
`;

const CloseButton = () => {
  return (
    <StyledCloseButtonWrapper>
      <IoClose />
    </StyledCloseButtonWrapper>
  )
}

export default CloseButton