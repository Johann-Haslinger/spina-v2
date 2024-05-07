import styled from "@emotion/styled";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { useContext } from "react";
import { IoHeadset } from "react-icons/io5";
import tw from "twin.macro";
import { Stories } from "../../../../base/enums";

const StyledCellWrapper = styled.div`
  ${tw`  w-full flex bg-blue-800 text-white  cursor-pointer  items-center justify-center pr-3 text-8xl md:hover:text-9xl md:hover:scale-105  transition-all h-40`}
`;

const PodcastCollectionCard = () => {
  const lsc = useContext(LeanScopeClientContext);

  const openPodcastCollection = () => lsc.stories.transitTo(Stories.OBSERVING_PODCASTS_COLLECTION);

  return (
    <StyledCellWrapper onClick={openPodcastCollection}>
      <IoHeadset />
    </StyledCellWrapper>
  );
};

export default PodcastCollectionCard;
