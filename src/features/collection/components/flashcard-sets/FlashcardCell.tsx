import styled from '@emotion/styled';
import { EntityProps } from '@leanscope/ecs-engine';
import { Tags } from '@leanscope/ecs-models';
import tw from 'twin.macro';
import { AnswerProps, MasteryLevelProps, QuestionProps } from '../../../../app/additionalFacets';
import { useSelectedSchoolSubjectColor } from '../../hooks/useSelectedSchoolSubjectColor';
import { MAX_MASTERY_LEVEL, MIN_MASTERY_LEVEL } from '../../../../base/constants';

const StyledFlashcardCellWrapper = styled.div<{
  backgroundColor: string;
}>`
  ${tw`w-full cursor-pointer bg-tertiary h-40 dark:bg-tertiaryDark dark:text-white  rounded-lg p-3 transition-all md:hover:scale-105`}
`;

const StyledTextWrapper = styled.div`
  ${tw`h-28`}
`;

const StyledQuestionText = styled.div`
  ${tw`text-lg font-semibold line-clamp-2`}
`;
const StyledAnswerText = styled.div`
  ${tw` line-clamp-2  transition-all text-seconderyText dark:text-seconderyTextDark mb-3 h-12`}
`;

const StyledProgressBarWrapper = styled.div`
  ${tw`flex items-center  transition-all rounded-full bg-white dark:bg-primaryDark mt-3 `}
`;

const StyledProgressBar = styled.div<{
  width: string;
  backgroundColor: string;
}>`
  ${tw` h-0.5 dark:bg-white bg-opacity-90  transition-all bg-primaryColor rounded-full`}

  width: ${(props) => props.width};
`;

const FlashcardCell = (props: QuestionProps & AnswerProps & EntityProps & MasteryLevelProps) => {
  const { question, answer, entity, masteryLevel = 0 } = props;
  const { color: accentColor } = useSelectedSchoolSubjectColor();

  const openFlashcard = () => entity.add(Tags.SELECTED);

  return (
    <StyledFlashcardCellWrapper onClick={openFlashcard} backgroundColor={accentColor}>
      <StyledTextWrapper>
        {' '}
        <StyledQuestionText>{question}</StyledQuestionText>
        <StyledAnswerText>{answer}</StyledAnswerText>
      </StyledTextWrapper>
      <StyledProgressBarWrapper>
        <StyledProgressBar
          backgroundColor={accentColor}
          width={((masteryLevel ? masteryLevel : MIN_MASTERY_LEVEL) / MAX_MASTERY_LEVEL) * 100 + 2 + '%'}
        />
      </StyledProgressBarWrapper>
    </StyledFlashcardCellWrapper>
  );
};

export default FlashcardCell;
