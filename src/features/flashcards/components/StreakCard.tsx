import styled from '@emotion/styled';
import { useEntity } from '@leanscope/ecs-engine';
import { useEffect, useState } from 'react';
import { IoCheckmark, IoFlame } from 'react-icons/io5';
import tw from 'twin.macro';
import { DateUpdatedFacet, StreakFacet } from '../../../app/additionalFacets';

const StyledCardWrapper = styled.div`
  ${tw`w-full h-[11rem] flex flex-col justify-between p-4 rounded-2xl text-[#A3CB63] bg-[#A3CB63] bg-opacity-15`}
`;


const StyledStreakLabel = styled.div<{ currentStrak: boolean }>`
  ${tw`text-[#A3CB63] mt-1 font-semibold`}
  ${({ currentStrak }) => (currentStrak ? tw`text-4xl` : tw`text-2xl mt-2 leading-7`)}
`;

const StyledCheckbox = styled.div<{ isChecked: boolean }>`
  ${tw`flex items-center justify-center size-7 rounded-md text-xl text-white bg-[#A3CB63]`}
  ${({ isChecked }) => (isChecked ? tw` bg-opacity-80` : tw` bg-opacity-40`)}
`;

const StyledCheckmarksContainer = styled.div`
  ${tw`flex space-x-2`}
`;

const StreakCard = () => {
  const { isCurrentStreakEntityExisting, streak, streakEndIndex, streakStartIndex } = useCurrentStreak();

  return (
    <StyledCardWrapper>
      <div tw="h-24">
        <div tw="flex space-x-2 md:opacity-80 items-center">
          <div tw="">
            <IoFlame />
          </div>
          <div tw="font-bold text-sm">Aktuelle Streak</div>
        </div>
        <StyledStreakLabel currentStrak={isCurrentStreakEntityExisting}>
          {isCurrentStreakEntityExisting ? `${streak} Tage` : 'Bereit für eine neue Streak?'}
        </StyledStreakLabel>
      </div>

      <StyledCheckmarksContainer>
        {Array.from({ length: 7 }).map((_, index) => {
          const isChecked = index >= streakStartIndex && index <= streakEndIndex && streak > 1;
          return (
            <StyledCheckbox key={index} isChecked={isChecked}>
              {isChecked && <IoCheckmark />}
            </StyledCheckbox>
          );
        })}{' '}
      </StyledCheckmarksContainer>
    </StyledCardWrapper>
  );
};

export default StreakCard;

const useCurrentStreak = () => {
  const [currentStreakEntity] = useEntity((e) => e.has(StreakFacet));
  const isCurrentStreakEntityExisting = currentStreakEntity !== undefined;
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

      const endIndex = Math.min(6, 6 - daysSinceLastUpdate);
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
