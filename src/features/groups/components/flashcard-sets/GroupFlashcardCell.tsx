import styled from "@emotion/styled";
import { EntityProps } from "@leanscope/ecs-engine";
import tw from "twin.macro";
import { AnswerProps, QuestionProps } from "../../../../app/additionalFacets";

const StyledGroupFlashcardCellWrapper = styled.div`
  ${tw`w-full cursor-pointer bg-black bg-opacity-5 h-40 dark:bg-tertiaryDark dark:text-white  rounded-lg p-3 transition-all md:hover:scale-105`}

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



const GroupFlashcardCell = (props: QuestionProps & AnswerProps & EntityProps) => {
  const { question, answer = 0 } = props;

  return (
    <StyledGroupFlashcardCellWrapper >
      <StyledTextWrapper>
        {" "}
        <StyledQuestionText>{question}</StyledQuestionText>
        <StyledAnswerText>{answer}</StyledAnswerText>
      </StyledTextWrapper>

    </StyledGroupFlashcardCellWrapper>
  );
};

export default GroupFlashcardCell;
