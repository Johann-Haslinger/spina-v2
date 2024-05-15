import styled from "@emotion/styled";
import { AnswerProps, MasteryLevelProps, QuestionProps } from "../../../../app/a";
import { EntityProps } from "@leanscope/ecs-engine";
import tw from "twin.macro";
import { Tags } from "@leanscope/ecs-models";
import { useSelectedSchoolSubjectColor } from "../../hooks/useSelectedSchoolSubjectColor";

const StyledFlashcardCellWrapper = styled.div<{
  backgroundColor: string;
}>`
  ${tw`w-full cursor-pointer h-40 dark:bg-tertiaryDark text-white  rounded-lg p-3 transition-all md:hover:scale-105`}
  background-color: ${(props) => props.backgroundColor};
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

const StyledProgressBarWrapper = styled.div`
  ${tw`flex items-center  rounded-full bg-white bg-opacity-20 dark:bg-primaryDark mt-3 `}
`;

const StyledProgressBar = styled.div<{
  width: string;
}>`
  ${tw` h-0.5 bg-white rounded-full`}

  width: ${(props) => props.width};
`;

const FlashcardCell = (props: QuestionProps & AnswerProps & EntityProps & MasteryLevelProps) => {
  const { question, answer, entity, masteryLevel = 0 } = props;
  const { backgroundColor } = useSelectedSchoolSubjectColor();

  const openFlashcard = () => entity.add(Tags.SELECTED);

  return (
    <StyledFlashcardCellWrapper onClick={openFlashcard} backgroundColor={backgroundColor}>
      <StyledTextWrapper>
        {" "}
        <StyledQuestionText>{question}</StyledQuestionText>
        <StyledAnswerText>{answer}</StyledAnswerText>
      </StyledTextWrapper>
      <StyledProgressBarWrapper>
        <StyledProgressBar width={((masteryLevel ? masteryLevel : 0) / 5) * 100 + 2 + "%"} />
      </StyledProgressBarWrapper>
    </StyledFlashcardCellWrapper>
  );
};

export default FlashcardCell;
