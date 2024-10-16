import { ILeanScopeClient } from '@leanscope/api-client';
import { Entity } from '@leanscope/ecs-engine';
import { CountFacet, IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { DueDateFacet, PriorityFacet } from '../../common/types/additionalFacets';
import supabaseClient from '../../lib/supabase';
import { LearningUnitPriority, SupabaseTable } from '../types/enums';
import { addNotificationEntity } from './addNotificationEntity';

export const updatePriority = async (
  lsc: ILeanScopeClient,
  entity: Entity,
  priority: LearningUnitPriority,
  dueFlashcardEntity: Entity | undefined,
  ignoreFlashcardUpdate?: boolean,
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
      message: error.message,
      type: 'error',
    });
  }
  if (ignoreFlashcardUpdate) {
    return;
  }

  const newFlashcardDueDate = priority === LearningUnitPriority.PAUSED ? null : new Date().toISOString();

  const { error: updateFlashcardsError } = await supabaseClient
    .from(SupabaseTable.FLASHCARDS)
    .update({ due_date: newFlashcardDueDate })
    .eq('parent_id', id);

  if (updateFlashcardsError) {
    console.error('Error updating flashcards', updateFlashcardsError);
  }

  lsc.engine.entities
    .filter((e) => e.get(ParentFacet)?.props.parentId === id)
    .forEach((e) => e.add(new DueDateFacet({ dueDate: newFlashcardDueDate })));

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
