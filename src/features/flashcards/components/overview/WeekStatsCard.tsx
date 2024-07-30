import styled from "@emotion/styled";
import tw from "twin.macro";

const StyledCardWrapper = styled.div`
  ${tw`md:w-2/3 h-[396px] rounded-2xl bg-opacity-40 bg-[#668FE7]`}
`;

const WeekStatsCard = () => {
  return <StyledCardWrapper></StyledCardWrapper>;
};

export default WeekStatsCard;
