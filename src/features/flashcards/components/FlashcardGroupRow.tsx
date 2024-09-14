import styled from '@emotion/styled';
import { EntityProps } from '@leanscope/ecs-engine';
import { Tags } from '@leanscope/ecs-models';
import tw from 'twin.macro';
import { PriorityProps, TitleProps } from '../../../app/additionalFacets';
import { COLOR_ITEMS } from '../../../base/constants';
import { LearningUnitPriority } from '../../../base/enums';
import { updatePriority } from '../../../common/utilities';
import { useDueFlashcards } from '../hooks';

const StyledRowWrapper = styled.div`
  ${tw`flex pl-2  justify-between`}
`;

const StyledSelect = styled.select<{ value: LearningUnitPriority }>`
  ${tw`rounded-lg h-fit text-sm pl-1 py-0.5 outline-none`}
  background-color: ${({ value }) => {
    switch (value) {
      case LearningUnitPriority.ACTIVE:
        return COLOR_ITEMS[1].color + 40;
      case LearningUnitPriority.MAINTAINING:
        return COLOR_ITEMS[2].color + 40;
    }
  }};
  ${({ value }) => value === LearningUnitPriority.PAUSED && tw` bg-tertiary dark:bg-tertiaryDark`}
`;

const FlashcardGroupRow = (props: TitleProps & PriorityProps & EntityProps) => {
  const { title, entity, priority } = props;
  const { dueFlashcardEntity } = useDueFlashcards();

  const openFlashcardGroup = () => entity.add(Tags.SELECTED);

  return (
    <StyledRowWrapper>
      <div tw=" hover:underline " onClick={openFlashcardGroup}>
        {title}
      </div>
      <StyledSelect
        onChange={(e) => updatePriority(entity, Number(e.target.value) as LearningUnitPriority, dueFlashcardEntity)}
        value={priority}
      >
        <option value={LearningUnitPriority.ACTIVE}>Aktiv</option>
        <option value={LearningUnitPriority.MAINTAINING}>Aufrechterhalten</option>
        <option value={LearningUnitPriority.PAUSED}>Pausiert</option>
      </StyledSelect>
    </StyledRowWrapper>
  );
};

export default FlashcardGroupRow;
