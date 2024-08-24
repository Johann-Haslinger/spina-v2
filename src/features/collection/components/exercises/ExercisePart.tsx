import styled from '@emotion/styled/macro';
import { Entity, EntityProps } from '@leanscope/ecs-engine';
import { useEntityHasTags } from '@leanscope/ecs-engine/react-api/hooks/useEntityComponents';
import { OrderFacet, OrderProps, Tags } from '@leanscope/ecs-models';
import { IoChevronForward, IoChevronUp } from 'react-icons/io5';
import tw from 'twin.macro';
import { AnswerProps, QuestionProps } from '../../../../app/additionalFacets';
import { COLOR_ITEMS } from '../../../../base/constants';
import { useExerciseParts } from '../../hooks/useExerciseParts';
import { useState } from 'react';

const SytledExercisePartWrapper = styled.div<{
  backgroundColor: string;
  color: string;
  first: boolean;
  last: boolean;
}>`
  ${tw`w-full py-2.5 flex justify-between px-4`}
  ${({ first }) => (first ? tw`rounded-t-xl` : null)}
  ${({ last }) => (last ? tw`rounded-b-xl` : null)}
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ color }) => color};
`;

const StyledLeftSideWrapper = styled.div`
  ${tw`flex space-x-4`}
`;

const StyledQuestionText = styled.div`
  ${tw`  font-semibold`}
`;

const StyledExercisePartIndicator = styled.div<{ backgroundColor: string }>`
  ${tw`text-white text-opacity-60  size-6 flex items-center justify-center font-bold rounded-full`}
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const StyledMoreButton = styled.div`
  ${tw` text-lg my-1`}
`;
const StyledTextarea = styled.div`
  ${tw`w-full min-h-60 my-4 outline-none `}
`;

const useExercisePartColor = (entity: Entity) => {
  const order = entity.get(OrderFacet)?.props.orderIndex || 0;
  const color = COLOR_ITEMS[order % COLOR_ITEMS.length];

  return color.backgroundColor;
};

function numberToLetter(num: number): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';

  return alphabet[num];
}

const ExercisePart = (props: QuestionProps & AnswerProps & OrderProps & EntityProps) => {
  const { orderIndex, question, entity } = props;
  const color = useExercisePartColor(entity);
  const { exercisePartsCount } = useExerciseParts(undefined, entity);
  const [isTextareaVisible] = useEntityHasTags(entity, Tags.SELECTED);
  const [userAnswer, setUserAnswer] = useState('');

  console.log('userAnswer', userAnswer);

  const toggleTextareaVisibility = () => (isTextareaVisible ? entity.remove(Tags.SELECTED) : entity.add(Tags.SELECTED));

  return (
    <div>
      <SytledExercisePartWrapper
        last={orderIndex == exercisePartsCount - 1 || isTextareaVisible == true}
        first={orderIndex == 0}
        color={color}
        backgroundColor={color + '90'}
        onClick={toggleTextareaVisibility}
      >
        <StyledLeftSideWrapper>
          <StyledExercisePartIndicator backgroundColor={color}>
            {' '}
            {numberToLetter(orderIndex || 0)}
          </StyledExercisePartIndicator>
          <StyledQuestionText> {question}</StyledQuestionText>
        </StyledLeftSideWrapper>

        <StyledMoreButton>{isTextareaVisible ? <IoChevronUp /> : <IoChevronForward />}</StyledMoreButton>
      </SytledExercisePartWrapper>
      {isTextareaVisible && <StyledTextarea contentEditable onBlur={(e) => setUserAnswer(e.currentTarget.innerText)} />}
    </div>
  );
};

export default ExercisePart;
