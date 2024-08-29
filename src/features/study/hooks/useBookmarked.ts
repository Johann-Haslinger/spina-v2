import { Entity } from '@leanscope/ecs-engine';
import { useEntityHasTags } from '@leanscope/ecs-engine/react-api/hooks/useEntityComponents';
import { IdentifierFacet } from '@leanscope/ecs-models';
import { AdditionalTag, DataType, SupabaseColumn, SupabaseTable } from '../../../base/enums';
import supabaseClient from '../../../lib/supabase';

const changeFlashcardSetBookmarkedStatus = async (status: boolean, id: string) => {
  const { error } = await supabaseClient
    .from(SupabaseTable.FLASHCARD_SETS)
    .update({ bookmarked: status })
    .eq(SupabaseColumn.ID, id);
  if (error) {
    console.error('Error updating flashcardSets:', error);
  }
};

const changeSubtopicBookmarkedStatus = async (status: boolean, id: string) => {
  const { error } = await supabaseClient
    .from(SupabaseTable.SUBTOPICS)
    .update({ bookmarked: status })
    .eq(SupabaseColumn.ID, id);
  if (error) {
    console.error('Error updating subtopics:', error);
  }
};

const changeFlashcardBookmarkedStatus = async (status: boolean, id: string) => {
  const { error } = await supabaseClient
    .from(SupabaseTable.FLASHCARDS)
    .update({ bookmarked: status })
    .eq(SupabaseColumn.ID, id);
  if (error) {
    console.error('Error updating flashcards:', error);
  }
};

const changeNoteBookmarkedStatus = async (status: boolean, id: string) => {
  const { error } = await supabaseClient
    .from(SupabaseTable.NOTES)
    .update({ bookmarked: status })
    .eq(SupabaseColumn.ID, id);
  if (error) {
    console.error('Error updating notes:', error);
  }
};

export const useBookmarked = (entity: Entity) => {
  const [isBookmarked] = useEntityHasTags(entity, AdditionalTag.BOOKMARKED);
  const [isFlashcardSet] = useEntityHasTags(entity, DataType.FLASHCARD_SET);
  const [isSubtopic] = useEntityHasTags(entity, DataType.SUBTOPIC);
  const [isNote] = useEntityHasTags(entity, DataType.NOTE);
  const [isFlashcard] = useEntityHasTags(entity, DataType.FLASHCARD);
  const id = entity.get(IdentifierFacet)?.props.guid;

  const toggleBookmark = async () => {
    if (id) {
      if (isBookmarked) {
        entity.removeTag(AdditionalTag.BOOKMARKED);
        if (isFlashcardSet) {
          await changeFlashcardSetBookmarkedStatus(false, id);
        } else if (isSubtopic) {
          await changeSubtopicBookmarkedStatus(false, id);
        } else if (isFlashcard) {
          await changeFlashcardBookmarkedStatus(false, id);
        } else if (isNote) {
          await changeNoteBookmarkedStatus(false, id);
        }
      } else {
        entity.addTag(AdditionalTag.BOOKMARKED);
        if (isFlashcardSet) {
          await changeFlashcardSetBookmarkedStatus(true, id);
        } else if (isSubtopic) {
          await changeSubtopicBookmarkedStatus(true, id);
        } else if (isFlashcard) {
          await changeFlashcardBookmarkedStatus(true, id);
        } else if (isNote) {
          await changeNoteBookmarkedStatus(true, id);
        }
      }
    }
  };

  return { isBookmarked, toggleBookmark };
};
