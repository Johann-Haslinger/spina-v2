import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { EntityProps, useEntityComponents } from '@leanscope/ecs-engine';
import { Tags } from '@leanscope/ecs-models';
import { motion } from 'framer-motion';
import { useContext, useState } from 'react';
import tw from 'twin.macro';
import { useWindowDimensions } from '../../../common/hooks/useWindowDimensions';
import { DateAddedProps, PriorityFacet, PriorityProps, TitleProps } from '../../../common/types/additionalFacets';
import { COLOR_ITEMS } from '../../../common/types/constants';
import { LearningUnitPriority } from '../../../common/types/enums';
import { updatePriority } from '../../../common/utilities';
import { useFormattedDateAdded } from '../../collection/hooks/useFormattedDateAdded';
import { useDueFlashcards } from '../hooks';

enum FlashcardGroupFilter {
  ALL = -1,
  ACTIVE = 1,
  MAINTAINING = 2,
  PAUSED = 0,
}

const StyledRowWrapper = styled(motion.div)`
  ${tw`h-14 items-center py-1 rounded-lg`}
`;

const StyledSelect = styled.select<{ value: LearningUnitPriority }>`
  ${tw`rounded-lg text-sm pl-1  h-full outline-none`}
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

interface FlashcardGroupRowProps extends TitleProps, PriorityProps, EntityProps, DateAddedProps {
  currentFilter: FlashcardGroupFilter;
}

const FlashcardGroupRow = (props: FlashcardGroupRowProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, entity, currentFilter, dateAdded } = props;
  const fourteenDaysAgo = new Date(new Date().setDate(new Date().getDate() - 14)).toISOString();
  const { dueFlashcardEntity } = useDueFlashcards();
  const formattedDateAdded = useFormattedDateAdded(entity, true);
  const { isMobile } = useWindowDimensions();
  const [priorityFacet] = useEntityComponents(entity, PriorityFacet);
  const priority = priorityFacet?.props.priority || LearningUnitPriority.PAUSED;
  const [updatedPriority, setUpdatedPriority] = useState(priority);
  const isFlashcardGroupInTimeRange = dateAdded >= fourteenDaysAgo;
  const isVisible =
    (currentFilter === FlashcardGroupFilter.ALL && updatedPriority == LearningUnitPriority.ACTIVE) ||
    currentFilter == updatedPriority.valueOf() ||
    isFlashcardGroupInTimeRange;

  const openFlashcardGroup = () => entity.add(Tags.SELECTED);

  return (
    <StyledRowWrapper
      animate={{
        x: isVisible ? 0 : 400,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.2, type: 'tween' }}
    >
      <div tw="transition-all overflow-hidden  flex justify-between md:hover:scale-105 w-full h-full">
        <div tw="w-48 md:w-full  pr-2 " onClick={openFlashcardGroup}>
          <p tw="line-clamp-1 overflow-hidden">{title}</p>
          <p tw="line-clamp-1 text-secondary-text dark:text-secondary-text-dark text-sm">
            {isMobile ? formattedDateAdded.replace('Hinzugefügt am ', '') : formattedDateAdded}
          </p>
        </div>
        <div tw="h-full py-2.5 ">
          <StyledSelect
            onChange={(e) => {
              let updatedPriority = Number(e.target.value) as LearningUnitPriority;
              console.log('updatedPriority1', updatedPriority);
              setUpdatedPriority(updatedPriority);
              setTimeout(() => {
                updatePriority(lsc, entity, updatedPriority, dueFlashcardEntity);
              }, 250);
            }}
            value={priority}
          >
            <option value={LearningUnitPriority.ACTIVE}>Aktiv</option>
            <option value={LearningUnitPriority.MAINTAINING}>Aufrechterhalten</option>
            <option value={LearningUnitPriority.PAUSED}>Pausiert</option>
          </StyledSelect>
        </div>
      </div>
    </StyledRowWrapper>
  );
};

export default FlashcardGroupRow;
