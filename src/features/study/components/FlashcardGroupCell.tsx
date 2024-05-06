import { Tags } from "@leanscope/ecs-models";
import { DateAddedProps, TitleProps } from "../../../app/AdditionalFacets";
import { EntityProps } from "@leanscope/ecs-engine";
import styled from "@emotion/styled/macro";
import tw from "twin.macro";
import { formatTime } from "../../../utils/formatTime";
import { IoPlay } from "react-icons/io5";
import { useContext } from "react";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Stories } from "../../../base/enums";

const StyledFlashcardGroupCellWrapper = styled.div`
  ${tw`w-full h-40 p-3 text-white transition-all hover:scale-105`}
  /* background-color: #00965F; */
  background-color: blue;
`;
const StyledFlashcardGroupCellTitle = styled.div`
  ${tw` line-clamp-2 font-semibold`}
`;
const StyledFlashcardGroupCellSubtitle = styled.div`
  ${tw` line-clamp-1 text-sm  opacity-70`}
`;

const StyledIconWrapper = styled.div`
  ${tw`bg-white w-fit mb-2 hover:scale-110 transition-all  text-lg rounded-full p-1.5 bg-opacity-20`}
`;
const FlashcardGroupCell = (props: TitleProps & EntityProps & DateAddedProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, entity, dateAdded } = props;

  const openFlashcardGroup = () => entity.add(Tags.SELECTED);

  const openFlashcardQuiz = () => {
    entity.addTag(Tags.SELECTED);

    lsc.stories.transitTo(Stories.OBSERVING_FLASHCARD_QUIZ_STORY);
  };

  return (
    <StyledFlashcardGroupCellWrapper onClick={openFlashcardGroup}>
      <StyledIconWrapper onClick={openFlashcardQuiz}>
        <IoPlay />
      </StyledIconWrapper>
      <StyledFlashcardGroupCellTitle>{title}</StyledFlashcardGroupCellTitle>
      <StyledFlashcardGroupCellSubtitle>{formatTime(dateAdded)}</StyledFlashcardGroupCellSubtitle>
    </StyledFlashcardGroupCellWrapper>
  );
};

export default FlashcardGroupCell;
