import styled from "@emotion/styled";
import tw from "twin.macro";

const StyledProgressBarWrapper = styled.div`
  ${tw`flex items-center w-full  rounded-full bg-secondery dark:bg-primaryDark  `}
`;

const StyledProgressBar = styled.div<{
  width: string;
}>`
  ${tw` h-0.5 bg-primaryColor  rounded-full`}

  width: ${(props) => props.width};
`;

interface ProgressBarProps {
  width: number;
}
const ProgressBar = (props: ProgressBarProps) => {
  const { width } = props;

  return (
    <StyledProgressBarWrapper>
      <StyledProgressBar width={width + "%"} />
    </StyledProgressBarWrapper>
  );
};

export default ProgressBar;
