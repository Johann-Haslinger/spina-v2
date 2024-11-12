import styled from '@emotion/styled';
import { useEntities } from '@leanscope/ecs-engine';
import { useEffect, useState } from 'react';
import { IoCheckmark, IoFlame, IoSnowOutline } from 'react-icons/io5';
import Skeleton from 'react-loading-skeleton';
import tw from 'twin.macro';
import { useLoadingIndicator } from '../../../common/hooks';
import { DateUpdatedFacet, StreakFacet } from '../../../common/types/additionalFacets';

const StyledCardWrapper = styled.div`
  ${tw`w-full min-h-[10rem] h-fit md:h-[10rem] flex flex-col justify-between p-4 rounded-2xl bg-[#A3CB63] bg-opacity-15`}
`;

const StyledCheckbox = styled.div<{ isChecked: boolean; isFrozen: boolean }>`
  ${tw`flex items-center justify-center size-8 rounded-md text-2xl text-white bg-[#A3CB63]`}
  ${({ isChecked }) => (isChecked ? tw`bg-opacity-80` : tw`bg-opacity-20`)}
  ${({ isFrozen }) => isFrozen && tw`bg-opacity-15 text-[#A3CB63]`}
`;

const StyledCheckmarksContainer = styled.div`
  ${tw`flex mt-4 space-x-2`}
`;

const StyledStreakHeader = styled.div`
  ${tw`flex space-x-2 text-[#A3CB63] items-center`}
`;

const StyledStreakTitle = styled.div`
  ${tw`font-bold text-sm`}
`;

const StyledStreakContent = styled.div`
  ${tw`font-medium mt-2`}
`;

const StyledSkeletonContainer = styled.div`
  ${tw`w-full mt-3 dark:opacity-10 transition-all`}
`;

const StyledSkeletonFull = styled(Skeleton)`
  ${tw`w-full h-3`}
`;

const StyledSkeletonHalf = styled(Skeleton)`
  ${tw`w-1/2 h-3`}
`;

const StreakCard = () => {
  const { isCurrentStreakEntityExisting, streak, streakEndIndex, streakStartIndex } = useCurrentStreak();
  const isFrozen = streakEndIndex < 5 && streakEndIndex !== 0;
  const { isLoadingIndicatorVisible } = useLoadingIndicator();

  return (
    <StyledCardWrapper>
      <div>
        <StyledStreakHeader>
          <IoFlame />
          <StyledStreakTitle>Aktuelle Streak</StyledStreakTitle>
        </StyledStreakHeader>

        {!isLoadingIndicatorVisible ? (
          <StyledStreakContent>
            {isFrozen ? (
              'Deine Streak ist eingefroren. Starte eine Lernrunde um sie fortzusetzten!'
            ) : isCurrentStreakEntityExisting ? (
              <p>
                Du hast bereits{' '}
                <strong>
                  {streak} {streak == 1 ? 'Tag' : 'Tage'}
                </strong>{' '}
                in Folge gelernt. 🎉{' '}
              </p>
            ) : (
              'Bist du bereit für eine neue Streak? 🚀'
            )}
          </StyledStreakContent>
        ) : (
          <StyledSkeletonContainer>
            <StyledSkeletonFull baseColor="#CFE0B4" highlightColor="#DAE6C8" borderRadius={4} />
            <StyledSkeletonHalf baseColor="#CFE0B4" highlightColor="#DAE6C8" borderRadius={4} />
          </StyledSkeletonContainer>
        )}
      </div>

      {!isLoadingIndicatorVisible && (
        <StyledCheckmarksContainer>
          {Array.from({ length: 7 }).map((_, index) => {
            const isChecked = index >= streakStartIndex && index <= streakEndIndex && streak >= 1;
            const isFrozen = index > streakEndIndex && index !== 6 && streak >= 1;

            return (
              <StyledCheckbox isFrozen={isFrozen} key={index} isChecked={isChecked || isFrozen}>
                {isChecked && <IoCheckmark />}
                {isFrozen && <IoSnowOutline />}
              </StyledCheckbox>
            );
          })}
        </StyledCheckmarksContainer>
      )}
    </StyledCardWrapper>
  );
};

export default StreakCard;

const useCurrentStreak = () => {
  const [currentStreakEntity] = useEntities((e) => e.has(StreakFacet))[0];
  const isCurrentStreakEntityExisting =
    currentStreakEntity !== undefined && currentStreakEntity.get(StreakFacet)?.props.streak !== 0;
  const streak = currentStreakEntity?.get(StreakFacet)?.props.streak || 0;
  const dateUpdated = currentStreakEntity?.get(DateUpdatedFacet)?.props.dateUpdated || 0;
  const [streakEndIndex, setStreakEndIndex] = useState(0);
  const [streakStartIndex, setStreakStartIndex] = useState(0);

  useEffect(() => {
    if (streak > 0) {
      const today = new Date();
      const lastUpdated = new Date(dateUpdated);
      const timeDifference = today.getTime() - lastUpdated.getTime();
      const daysSinceLastUpdate = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

      const endIndex = 6 - daysSinceLastUpdate;
      setStreakEndIndex(endIndex);

      const startIndex = Math.max(0, endIndex - streak + 1);
      setStreakStartIndex(startIndex);
    }
  }, [streak, dateUpdated]);

  return {
    isCurrentStreakEntityExisting,
    streak,
    streakStartIndex,
    streakEndIndex,
  };
};
