import styled from "@emotion/styled";
import { useEntities } from "@leanscope/ecs-engine";
import { useEffect, useState } from "react";
import tw from "twin.macro";
import {
  DateAddedFacet,
  FlashcardCountFacet,
} from "../../../../app/additionalFacets";
import { DataTypes } from "../../../../base/enums";
import { dataTypeQuery } from "../../../../utils/queries";

/* <div tw="pr-6 h-10 w-full">
        <StyledDivider tw="bottom-[174px]" />
        <StyledDivider tw="bottom-[322px]" />
      </div> */

const StyledCardWrapper = styled.div`
  ${tw`md:w-2/3 pl-6 pr-8  pt-14 pb-4 h-[396px] rounded-2xl bg-opacity-40 bg-[#668FE7]`}
`;

const StyledColumnWrapper = styled.div`
  ${tw`flex flex-col border-[#668FE7] border-opacity-20 h-[292px]`}
`;

const StyledBar = styled.div`
  ${tw`bg-[#668FE7] hover:opacity-80 transition-all mt-auto w-1/2 mx-auto rounded-t-lg bg-opacity-90 `}
`;

const StyledColumnLabel = styled.div`
  ${tw`text-[#668FE7] pt-2.5 text-center text-sm`}
`;

const StyledAverageMarker = styled.div`
  ${tw`border-[#668FE7] opacity-80 relative border-t border-dashed w-full`}
`;

const StyledColumnsWrapper = styled.div`
  ${tw`flex w-full  `}
`;

const StyledYLabelsWrapper = styled.div`
  ${tw`flex flex-col pl-2 text-sm pb-3 relative bottom-2 text-[#668FE7] text-center justify-between`}
`;

const WeekStatsCard = () => {
  const { weekDays, maxFlashcards, averageFlashcards, dayLabels } =
    useWeekStats();

  return (
    <StyledCardWrapper>
      <StyledColumnsWrapper>
        <div tw="w-16 h-[292px]">
          <div
            style={{
              height: `${100 - (averageFlashcards / maxFlashcards) * 100}%`,
            }}
          />
          <div tw="text-[#668FE7] relative bottom-4 h-fit">
            <div tw="font-bold">{averageFlashcards}</div>
            <div tw="text-sm relative bottom-1">
              {averageFlashcards === 1 ? "Karte" : "Karten"}
            </div>
          </div>
        </div>
        {weekDays.map((count, idx) => (
          <div style={{ width: `${100 / weekDays.length}%` }} key={idx}>
            <StyledColumnWrapper>
              <StyledBar
                style={{
                  height: `${(count / maxFlashcards) * 100}%`,
                }}
              />
            </StyledColumnWrapper>
            <StyledColumnLabel>
              {idx === 6 ? "Heute" : dayLabels[idx]}
            </StyledColumnLabel>
          </div>
        ))}
        <StyledYLabelsWrapper>
          <div>{maxFlashcards}</div>
          <div>{maxFlashcards / 2}</div>
          <div>0</div>
        </StyledYLabelsWrapper>
      </StyledColumnsWrapper>

      <div tw="pr-6 pl-14 h-10 w-full">
        <StyledAverageMarker
          style={{
            bottom: `${296 / (maxFlashcards / averageFlashcards) + 30}px`,
          }}
        />
      </div>
    </StyledCardWrapper>
  );
};

export default WeekStatsCard;

const useWeekStats = () => {
  const today = new Date();
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const [flashcardSessionEntities] = useEntities(
    (e) =>
      dataTypeQuery(e, DataTypes.FLASHCARD_SESSION) &&
      (e.get(DateAddedFacet)?.props.dateAdded || "") >
        sevenDaysAgo.toISOString(),
  );

  const [weekDays, setWeekDays] = useState<number[]>(new Array(7).fill(0));
  const [maxFlashcards, setMaxFlashcards] = useState(0);
  const [averageFlashcards, setAverageFlashcards] = useState(0);
  const [dayLabels, setDayLabels] = useState<string[]>([]);

  useEffect(() => {
    const newWeekDays = new Array(7).fill(0);
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      days.push(date.toLocaleString("de-DE", { weekday: "short" }));
    }

    flashcardSessionEntities.forEach((entity) => {
      const date = new Date(entity.get(DateAddedFacet)?.props.dateAdded || "");
      const flashcardCount =
        entity.get(FlashcardCountFacet)?.props.flashcardCount || 0;

      const dayDifference = Math.floor(
        (today.getTime() - date.getTime()) / (24 * 60 * 60 * 1000),
      );
      if (dayDifference <= 6) {
        newWeekDays[6 - dayDifference] += flashcardCount;
      }
    });

    setWeekDays(newWeekDays);

    const maxDay = Math.max(...newWeekDays);
    const evenMaxDay = maxDay % 2 === 0 ? maxDay : maxDay + 1;
    setMaxFlashcards(evenMaxDay);

    const average = Math.round(
      newWeekDays.reduce((acc, curr) => acc + curr, 0) / 7,
    );
    setAverageFlashcards(average);
    setDayLabels(days);
  }, [flashcardSessionEntities, today]);

  return { weekDays, maxFlashcards, averageFlashcards, dayLabels };
};
