import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { IoGrid } from 'react-icons/io5';
import tw from 'twin.macro';
import { SupabaseTable } from '../../../base/enums';
import supabaseClient from '../../../lib/supabase';

const StyledCardWrapper = styled.div`
  ${tw`w-full h-fit md:h-[28rem] overflow-y-hidden p-4 pr-0 rounded-2xl bg-[#3A7945] bg-opacity-15`}

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const StyledFlexContainer = styled.div`
  ${tw`flex text-[#3A7945] mb-2 space-x-2 items-center`}
`;

const StyledText = styled.div`
  ${tw`font-bold text-sm`}
`;

const StyledText2 = styled.div`
  ${tw`mt-2 pr-4 text-black dark:text-white font-medium`}
`;

const StyledWeekDayLabel = styled.div`
  ${tw`h-11 px-1 min-w-4 font-semibold text-secondary-text pr-2 text-xs xl:text-sm flex items-center w-full justify-center`}
`;

const LastFiftyDaysStatCard = () => {
  const { lastSevenWeeks, totalFlashcardCount } = useLastSevenWeeksStats();
  return (
    <div>
      <StyledCardWrapper>
        <StyledFlexContainer>
          <IoGrid />
          <StyledText>Letzte 50 Tage</StyledText>
        </StyledFlexContainer>
        <StyledText2>{totalFlashcardCount == 0 ?"Du hast dich in den letzten 50 Tage noch keine Lernkarten abgefragt.": `Du hast dich in den letzten 50 Tagen insgesamt ${totalFlashcardCount} Karten abgefragt.`}</StyledText2>

        <div tw="flex mt-6 xl:pl-2">
          {lastSevenWeeks.map((week, index) => (
            <div key={index}>
              {week.map((day, index) => (
                <DayBox day={day} key={index} />
              ))}
            </div>
          ))}
          <div tw="w-full">
            {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day) => (
              <StyledWeekDayLabel>
                {day[0]}
                <span tw="xl:block hidden">{day[1]}</span>
              </StyledWeekDayLabel>
            ))}
          </div>
        </div>
      </StyledCardWrapper>
    </div>
  );
};

export default LastFiftyDaysStatCard;

const DayBox = (props: { day: { percent: number; total: number } }) => {
  const { day } = props;
  const opacity = 10 + (day.percent > 0 ? day.percent + 0.1 : 0) * 100;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div tw="relative">
      {/* Box für die totale Anzahl der Karten */}
      {isHovered && (
        <div tw="absolute bottom-full">
          <div tw=" p-1 text-xs text-white bg-black font-semibold bg-opacity-20 backdrop-blur-lg rounded-full relative right-4 text-center w-20">
            {' '}
            {day.total} Karten
          </div>
        </div>
      )}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        tw="size-11 hover:opacity-80 transition-all flex justify-center items-center"
      >
        <div style={{ opacity: (opacity > 100 ? 100 : opacity) + '%' }} tw="size-10 rounded-md bg-[#3A7945]" />
      </div>
    </div>
  );
};

type FlashcardSession = {
  flashcard_count: number;
  session_date: string;
};

const getMaxFlashcardsPerDay = (flashcardSessions: FlashcardSession[]): number => {
  const flashcardsPerDay: { [date: string]: number } = {};

  flashcardSessions.forEach((session) => {
    const { session_date, flashcard_count } = session;
    if (flashcardsPerDay[session_date]) {
      flashcardsPerDay[session_date] += flashcard_count;
    } else {
      flashcardsPerDay[session_date] = flashcard_count;
    }
  });

  return Math.max(...Object.values(flashcardsPerDay));
};

const getLastSevenWeeksDates = (): string[] => {
  const dates: string[] = [];
  const today = new Date();

  for (let i = 0; i < 7 * 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }

  return dates.reverse();
};

const fetchLastSevenWeeksFlashcardSessions = async () => {
  const currentDate = new Date();
  const sevenWeeksAgo = new Date(currentDate.setDate(currentDate.getDate() - 49)).toISOString();
  const { data, error } = await supabaseClient
    .from(SupabaseTable.FLASHCARD_SESSIONS)
    .select(' session_date, flashcard_count')
    .gte('session_date', sevenWeeksAgo)
    .neq('flashcard_count', 0);

  if (error) {
    console.error('Error fetching last seven weeks flashcard sessions:', error);
    return [];
  }

  return data;
};

const useLastSevenWeeksStats = () => {
  const [lastSevenWeeks, setLastSevenWeeks] = useState<{ percent: number; total: number }[][]>(
    Array.from({ length: 7 }, () => Array.from({ length: 7 }, () => ({ percent: 0, total: 0 }))),
  );
  const totalFlashcardCount = lastSevenWeeks.reduce(
    (acc, week) => acc + week.reduce((acc, day) => acc + day.total, 0),
    0,
  );

  useEffect(() => {
    const loadLastSevenWeeksStats = async () => {
      const flashcardSessions: FlashcardSession[] = await fetchLastSevenWeeksFlashcardSessions();
      const maxFlashcardsPerDay = getMaxFlashcardsPerDay(flashcardSessions);
      const lastSevenWeeksDates = getLastSevenWeeksDates();

      const flashcardsPerDay: { [date: string]: number } = {};
      flashcardSessions.forEach((session) => {
        const { session_date, flashcard_count } = session;
        flashcardsPerDay[session_date] = flashcard_count;
      });

      // Neues Array, das sowohl den Prozentsatz als auch die totale Anzahl speichert
      const newLastSevenWeeks = Array.from({ length: 7 }, (_, weekIndex) =>
        Array.from({ length: 7 }, (_, dayIndex) => {
          const date = lastSevenWeeksDates[weekIndex * 7 + dayIndex];
          const cardsLearned = flashcardsPerDay[date] || 0;
          return {
            percent: maxFlashcardsPerDay ? cardsLearned / maxFlashcardsPerDay : 0,
            total: cardsLearned,
          };
        }),
      );

      setLastSevenWeeks(newLastSevenWeeks);
    };

    loadLastSevenWeeksStats();
  }, []);

  return { lastSevenWeeks, totalFlashcardCount };
};
