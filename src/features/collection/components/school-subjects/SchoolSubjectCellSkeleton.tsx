import styled from '@emotion/styled';
import Skeleton from 'react-loading-skeleton';
import tw from 'twin.macro';
import { useSelectedTheme } from '../../hooks/useSelectedTheme';

const StyledCellWrapper = styled.div`
  ${tw`  w-full    bg-tertiary dark:bg-secondary-dark  opacity-70 dark:opacity-40 transition-all h-40`}
`;

const SchoolSubjectCellSkeleton = () => {
  const { isDarkModeActive } = useSelectedTheme();

  return (
    <StyledCellWrapper>
      <Skeleton
        borderRadius={0}
        tw="w-full"
        height={'156px'}
        baseColor={isDarkModeActive ? '#1a1a1a' : '#eaeaea'}
        highlightColor={isDarkModeActive ? '#252525' : '#f0f0f0'}
      />
    </StyledCellWrapper>
  );
};

export default SchoolSubjectCellSkeleton;
