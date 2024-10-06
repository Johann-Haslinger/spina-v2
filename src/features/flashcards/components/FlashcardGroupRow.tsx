import styled from '@emotion/styled';
import { EntityProps } from '@leanscope/ecs-engine';
import { Tags } from '@leanscope/ecs-models';
import tw from 'twin.macro';
import { PriorityProps, TitleProps } from '../../../app/additionalFacets';
import { COLOR_ITEMS } from '../../../base/constants';
import { LearningUnitPriority } from '../../../base/enums';
import { updatePriority } from '../../../common/utilities';
import { useFormattedDateAdded } from '../../collection/hooks/useFormattedDateAdded';
import { useDueFlashcards } from '../hooks';

const StyledRowWrapper = styled.div`
  ${tw`flex  items-center py-1 transition-all  md:hover:scale-105  rounded-lg justify-between`}
`;

const StyledSelect = styled.select<{ value: LearningUnitPriority }>`
  ${tw`rounded-lg text-sm pl-1 min-h-7 h-fit outline-none`}
  background-color: ${({ value }) => {
    switch (value) {
      case LearningUnitPriority.ACTIVE:
        return COLOR_ITEMS[1].color + 40;
      case LearningUnitPriority.MAINTAINING:
        return COLOR_ITEMS[2].color + 40;
    }
  }};
  ${({ value }) => value === LearningUnitPriority.PAUSED && tw` bg-tertiary dark:bg-tertiary-dark`}
`;

const FlashcardGroupRow = (props: TitleProps & PriorityProps & EntityProps) => {
  const { title, entity, priority } = props;
  const { dueFlashcardEntity } = useDueFlashcards();
  const formattedDateAdded = useFormattedDateAdded(entity, true);

  const openFlashcardGroup = () => entity.add(Tags.SELECTED);

  return (
    <StyledRowWrapper>
      <div tw="  pr-2 " onClick={openFlashcardGroup}>
        <p tw="line-clamp-2">{title}</p>
        <p tw="line-clamp-1 text-secondary-text dark:text-secondary-text-dark text-sm">{formattedDateAdded}</p>
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
