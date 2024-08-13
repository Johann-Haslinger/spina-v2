import styled from '@emotion/styled';
import tw from 'twin.macro';

type SpacerSize = 1 | 2 | 4 | 6 | 8 | 14 | 20;

interface SpacerProps {
  size?: SpacerSize;
}

const StyledSpacer = styled.div<{ size: SpacerSize }>`
  ${tw`w-full `}
  height: ${({ size }) => size * 4}px;
`;

const Spacer = (props: SpacerProps) => {
  const { size = 4 } = props;
  return <StyledSpacer size={size} />;
};

export default Spacer;
