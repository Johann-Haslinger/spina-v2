import styled from '@emotion/styled';
import { Entity, EntityProps } from '@leanscope/ecs-engine';
import { CountFacet, IdentifierFacet, Tags } from '@leanscope/ecs-models';
import tw from 'twin.macro';
import { PriorityFacet, PriorityProps, TitleProps } from '../../../app/additionalFacets';
import { COLOR_ITEMS } from '../../../base/constants';
import { DataType, FlashcardGroupPriority, SupabaseTable } from '../../../base/enums';
import supabaseClient from '../../../lib/supabase';
import { useDueFlashcards } from '../hooks';

const StyledRowWrapper = styled.div`
  ${tw`flex pl-2  justify-between`}
`;

const StyledSelect = styled.select<{ value: FlashcardGroupPriority }>`
  ${tw`rounded-lg text-sm pl-2 py-1 outline-none`}
  background-color: ${({ value }) => {
    switch (value) {
      case FlashcardGroupPriority.ACTIVE:
        return COLOR_ITEMS[1].color + 40;
      case FlashcardGroupPriority.MAINTAINING:
        return COLOR_ITEMS[2].color + 40;
      case FlashcardGroupPriority.PAUSED:
        return COLOR_ITEMS[0].color + 40;
      default:
        return '#FFFFFF';
    }
  }};
`;

const updatePriority = async (
  entity: Entity,
  priority: FlashcardGroupPriority,
  dueFlashcardEntity: Entity | undefined,
) => {
  entity.add(new PriorityFacet({ priority: priority }));

  const id = entity.get(IdentifierFacet)?.props.guid;
  const dataType = entity.has(DataType.FLASHCARD_SET) ? DataType.FLASHCARD_SET : DataType.SUBTOPIC;

  const { error } = await supabaseClient
    .from(dataType == DataType.FLASHCARD_SET ? SupabaseTable.FLASHCARD_SETS : SupabaseTable.SUBTOPICS)
    .update({ priority })
    .eq('id', id);

  if (error) {
    console.error('Error updating priority', error);
  }

  const newFlashcardDueDate = priority === FlashcardGroupPriority.PAUSED ? null : new Date().toISOString();

  const { error: updateFlashcardsError } = await supabaseClient
    .from(SupabaseTable.FLASHCARDS)
    .update({ due_date: newFlashcardDueDate })
    .eq('parent_id', id);

  if (updateFlashcardsError) {
    console.error('Error updating flashcards', updateFlashcardsError);
  }

  const currentDate = new Date().toISOString();

  const { data, error: dueFlashcardsError } = await supabaseClient
    .from(SupabaseTable.FLASHCARDS)
    .select('bookmarked')
    .lte('due_date', currentDate);

  if (dueFlashcardsError) {
    console.error('Error fetching due flashcards', dueFlashcardsError);
  }

  const dueFlashcardsCount = data?.length || 0;
  dueFlashcardEntity?.add(new CountFacet({ count: dueFlashcardsCount }));
};

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
        onChange={(e) => updatePriority(entity, Number(e.target.value) as FlashcardGroupPriority, dueFlashcardEntity)}
        value={priority}
      >
        <option value={FlashcardGroupPriority.ACTIVE}>Aktiv</option>
        <option value={FlashcardGroupPriority.MAINTAINING}>Aufrechterhalten</option>
        <option value={FlashcardGroupPriority.PAUSED}>Pausiert</option>
      </StyledSelect>
    </StyledRowWrapper>
  );
};

export default FlashcardGroupRow;
