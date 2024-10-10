import { Entity } from '@leanscope/ecs-engine';
import { CountFacet, IdentifierFacet } from '@leanscope/ecs-models';
import { PriorityFacet } from '../../app/additionalFacets';
import { LearningUnitPriority, SupabaseTable } from '../../base/enums';
import supabaseClient from '../../lib/supabase';
import { addNotificationEntity } from './addNotificationEntity';
import { ILeanScopeClient } from '@leanscope/api-client';

export const updatePriority = async (
  lsc: ILeanScopeClient,
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
    addNotificationEntity(lsc, {
      title: 'Fehler beim Aktualisieren der Priorität',
      message: error.message + ' ' + error.details + ' ' + error.hint,
      type: 'error',
    });
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
    .select('is_bookmarked')
    .lte('due_date', currentDate);

  if (dueFlashcardsError) {
    console.error('Error fetching due flashcards', dueFlashcardsError);
    addNotificationEntity(lsc, {
      title: 'Fehler beim Abrufen der fälligen Karteikarten',
      message: dueFlashcardsError.message + ' ' + dueFlashcardsError.details + ' ' + dueFlashcardsError.hint,
      type: 'error',
    });
  }

  const dueFlashcardsCount = data?.length || 0;
  dueFlashcardEntity?.add(new CountFacet({ count: dueFlashcardsCount }));
};
