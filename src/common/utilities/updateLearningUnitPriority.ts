import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, CountFacet } from '@leanscope/ecs-models';
import { PriorityFacet } from '../../app/additionalFacets';
import { LearningUnitPriority, SupabaseTable } from '../../base/enums';
import supabaseClient from '../../lib/supabase';

export const updatePriority = async (
  entity: Entity,
  priority: LearningUnitPriority,
  dueFlashcardEntity: Entity | undefined,
) => {
  entity.add(new PriorityFacet({ priority: priority }));

  const id = entity.get(IdentifierFacet)?.props.guid;

  const { error } = await supabaseClient
    .from(SupabaseTable.LEARNING_UNITS)
    .update({ priority: LearningUnitPriority[priority] })
    .eq('id', id);

  if (error) {
    console.error('Error updating priority', error);
  }

  const newFlashcardDueDate = priority === LearningUnitPriority.PAUSED ? null : new Date().toISOString();

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
