import { Tags } from "@leanscope/ecs-models";
import { DateAddedProps, TitleProps } from "../../../app/AdditionalFacets";
import { EntityProps } from "@leanscope/ecs-engine";
import styled from "@emotion/styled/macro";
import tw from "twin.macro";
import { formatTime } from "../../../utils/formatTime";
import { IoBookmark, IoBookmarkOutline, IoPlay } from "react-icons/io5";
import { useContext, useState } from "react";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import {  Stories } from "../../../base/enums";
import { useBookmarked } from "../hooks/useBookmarked";

const StyledFlashcardGroupCellWrapper = styled.div`
  ${tw`w-full h-40 p-3 rounded-lg text-white transition-all hover:scale-105`}

  background-color: #00965F;
`;
const StyledFlashcardGroupCellTitle = styled.div`
  ${tw` line-clamp-2 font-semibold`}
`;
const StyledFlashcardGroupCellSubtitle = styled.div`
  ${tw` line-clamp-1 text-sm  opacity-70`}
`;

const StyledIconWrapper = styled.div`
  ${tw`bg-white w-fit mb-2 hover:opacity-50 transition-all  text-lg rounded-full p-1.5 bg-opacity-20`}
`;

const StyledButtonWrapper = styled.div`
  ${tw`flex space-x-2`}
`;

const TextWrapper = styled.div`
  ${tw`w-full  h-28`}
`;
const FlashcardGroupCell = (props: TitleProps & EntityProps & DateAddedProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, entity, dateAdded } = props;
  const [isHovered, setIsHovered] = useState(false);
  const { isBookmarked, toggleBookmark } = useBookmarked(entity);

  const openFlashcardGroup = () => entity.add(Tags.SELECTED);
  const openFlashcardQuiz = () => {
    entity.addTag(Tags.SELECTED);
    lsc.stories.transitTo(Stories.OBSERVING_FLASHCARD_QUIZ_STORY);
  };

  return (
    <StyledFlashcardGroupCellWrapper onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <StyledButtonWrapper>
        <StyledIconWrapper onClick={openFlashcardQuiz}>
          <IoPlay />
        </StyledIconWrapper>
        {(isHovered || isBookmarked) && (
          <StyledIconWrapper onClick={toggleBookmark}>
            {isBookmarked ? <IoBookmark /> : <IoBookmarkOutline />}
          </StyledIconWrapper>
        )}
      </StyledButtonWrapper>
      <TextWrapper onClick={openFlashcardGroup}>
        <StyledFlashcardGroupCellTitle>{title}</StyledFlashcardGroupCellTitle>
        <StyledFlashcardGroupCellSubtitle>{formatTime(dateAdded)}</StyledFlashcardGroupCellSubtitle>
      </TextWrapper>
    </StyledFlashcardGroupCellWrapper>
  );
};

export default FlashcardGroupCell;
