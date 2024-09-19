import styled from '@emotion/styled';
import Skeleton from 'react-loading-skeleton';
import tw from 'twin.macro';
import { useSelectedSchoolSubjectColor } from '../../hooks/useSelectedSchoolSubjectColor';

const StyledTopicCellContainer = styled.div`
  ${tw`w-full h-fit pb-6`}
`;

const TopicCellSkeleton = () => {
  const { color, backgroundColor } = useSelectedSchoolSubjectColor();

  return (
    <StyledTopicCellContainer>
      <Skeleton tw="w-full opacity-15 rounded-xl h-40" baseColor={color} highlightColor={backgroundColor} />
      <Skeleton borderRadius={4} tw="w-2/3 h-3 mt-6 opacity-10" baseColor={color} highlightColor={backgroundColor} />
      <Skeleton borderRadius={4} tw="w-full opacity-10 mt-2 h-3" baseColor={color} highlightColor={backgroundColor} />
      <Skeleton borderRadius={4} tw="w-full  opacity-10 h-3" baseColor={color} highlightColor={backgroundColor} />
    </StyledTopicCellContainer>
  );
};

export default TopicCellSkeleton;
