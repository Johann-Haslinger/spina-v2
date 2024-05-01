import styled from "@emotion/styled";
import {
  AnswerProps,
  MasteryLevelProps,
  QuestionProps,
} from "../../../../app/AdditionalFacets";
import { EntityProps } from "@leanscope/ecs-engine";
import tw from "twin.macro";
import { COLOR_ITEMS } from "../../../../base/constants";
import { Tags } from "@leanscope/ecs-models";
import { useContext } from "react";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Stories } from "../../../../base/enums";

const StyledFlashcardCellWrapper = styled.div<{
  backgroundColor: string;
  color: string;
}>`
  ${tw`w-full cursor-pointer h-40 dark:bg-tertiaryDark text-primatyText dark:text-primaryTextDark bg-tertiary rounded-lg p-3 transition-all hover:scale-105`}
`;

const StyledTextWrapper = styled.div`
  ${tw`h-28`}
`;

const StyledQuestionText = styled.div`
  ${tw`text-lg font-bold line-clamp-2`}
`;
const StyledAnswerText = styled.div`
  ${tw` line-clamp-2 mb-3 h-12`}
`;

const StyledProgressBarWrapper = styled.div<{ backgroundColor: string }>`
  ${tw`flex items-center  rounded-full bg-secondery dark:bg-primaryDark mt-3 `}
`;

const StyledProgressBar = styled.div<{
  width: string;
  backgroundColor: string;
}>`
  ${tw` h-0.5 bg-primaryColor  rounded-full`}
  /* background-color: ${(props) => props.backgroundColor}; */
  width: ${(props) => props.width};
`;


const FlashcardCell = (
  props: QuestionProps & AnswerProps & EntityProps & MasteryLevelProps
) => {
  const lsc = useContext(LeanScopeClientContext);
  const { question, answer, entity, masteryLevel } = props;
  const { backgroundColor, color } = COLOR_ITEMS[0];

  const openFlashcard = () =>{
    lsc.stories.transitTo(Stories.EDIT_FLASHCARD_STORY)
    entity.add(Tags.SELECTED)
  }

  return (
    <StyledFlashcardCellWrapper onClick={openFlashcard} backgroundColor={backgroundColor} color={color}>
      <StyledTextWrapper>
        {" "}
        <StyledQuestionText>{question}</StyledQuestionText>
        <StyledAnswerText>{answer}</StyledAnswerText>
      </StyledTextWrapper>
      <StyledProgressBarWrapper backgroundColor={color}>
        <StyledProgressBar
          backgroundColor={backgroundColor}
          width={((masteryLevel - 1) / 5) * 100 + 2 + "%"}
        />
      </StyledProgressBarWrapper>
    </StyledFlashcardCellWrapper>
  );
};

export default FlashcardCell;
