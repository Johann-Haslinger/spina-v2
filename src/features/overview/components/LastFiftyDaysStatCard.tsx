import styled from '@emotion/styled';
import { useState } from 'react';
import { IoRocket } from 'react-icons/io5';
import tw from 'twin.macro';
import { useLastSevenWeeksStats } from '../hooks/useLastSevenWeeksStats';

const StyledCardWrapper = styled.div`
  ${tw`w-full flex flex-col h-fit md:h-[28rem] overflow-y-hidden p-4 pr-0 rounded-2xl bg-[#3A7945] bg-opacity-15`}

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
  ${tw`h-10 px-1 text-center xl:min-w-8 min-w-4 font-semibold text-secondary-text pr-2 text-xs xl:text-sm flex items-center w-full justify-center`}
`;

const StyledWeekContainer = styled.div`
  ${tw`flex mt-6 py-2`}
`;

const StyledDayWrapper = styled.div`
  ${tw`relative`}
`;

const StyledHoverInfo = styled.div`
  ${tw`p-1 text-xs relative right-4 text-white bg-black font-semibold bg-opacity-20 backdrop-blur-lg rounded-full text-center w-20`}
`;

const StyledDayBox = styled.div`
  ${tw`size-10 xl:size-11 hover:opacity-80 transition-all flex justify-center items-center`}
`;

const StyledDayInnerBox = styled.div`
  ${tw`size-8  xl:size-9 rounded-md bg-[#3A7945]`}
`;

const StyledHiddenText = styled.span`
  ${tw`xl:block hidden`}
`;

const LastFiftyDaysStatCard = () => {
  const { lastSevenWeeks, totalFlashcardCount } = useLastSevenWeeksStats();

  return (
    <div>
      <StyledCardWrapper>
        <div>
          <StyledFlexContainer>
            <IoRocket />
            <StyledText>Letzte 50 Tage</StyledText>
          </StyledFlexContainer>
          <StyledText2>
            {totalFlashcardCount == 0
              ? 'Du hast dich in den letzten 50 Tagen noch keine Lernkarten abgefragt.'
              : `Du hast dich in den letzten 50 Tagen insgesamt ${totalFlashcardCount} Karten abgefragt.`}
          </StyledText2>
        </div>
        <StyledWeekContainer>
          {lastSevenWeeks.map((week, weekIndex) => (
            <div key={`week-${weekIndex}`}>
              {week.map((day, dayIndex) => (
                <DayBox day={day} key={`day-${weekIndex}-${dayIndex}`} />
              ))}
            </div>
          ))}
          <div tw="w-full">
            {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day) => (
              <StyledWeekDayLabel key={day}>
                {day[0]}
                <StyledHiddenText>{day[1]}</StyledHiddenText>
              </StyledWeekDayLabel>
            ))}
          </div>
        </StyledWeekContainer>
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
    <StyledDayWrapper>
      {isHovered && (
        <div tw="absolute bottom-full ">
          <StyledHoverInfo>{day.total} Karten</StyledHoverInfo>
        </div>
      )}
      <StyledDayBox onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <StyledDayInnerBox style={{ opacity: (opacity > 80 ? 80 : opacity) + '%' }} />
      </StyledDayBox>
    </StyledDayWrapper>
  );
};
