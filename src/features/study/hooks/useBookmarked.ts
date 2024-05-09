import { Entity } from "@leanscope/ecs-engine";
import { useEntityHasTags } from "@leanscope/ecs-engine/react-api/hooks/useEntityComponents";
import { AdditionalTags, DataTypes } from "../../../base/enums";
import supabaseClient from "../../../lib/supabase";
import { IdentifierFacet } from "@leanscope/ecs-models";

const changeFlashcardSetBookmarkedStatus = async (status: boolean, id: string) => {
  const { error } = await supabaseClient.from("flashcardSets").update({ bookmarked: status }).eq("id", id);
  if (error) {
    console.error("Error updating flashcardSets:", error);
  }
};

const changeSubtopicBookmarkedStatus = async (status: boolean, id: string) => {
  const { error } = await supabaseClient.from("subTopics").update({ bookmarked: status }).eq("id", id);
  if (error) {
    console.error("Error updating subtopics:", error);
  }
};

const changeFlashcardBookmarkedStatus = async (status: boolean, id: string) => {
  const { error } = await supabaseClient.from("flashCards").update({ bookmarked: status }).eq("id", id);
  if (error) {
    console.error("Error updating flashcards:", error);
  }
};

const changeNoteBookmarkedStatus = async (status: boolean, id: string) => {
  const { error } = await supabaseClient.from("notes").update({ bookmarked: status }).eq("id", id);
  if (error) {
    console.error("Error updating notes:", error);
  }
};

export const useBookmarked = (entity: Entity) => {
  const [isBookmarked] = useEntityHasTags(entity, AdditionalTags.BOOKMARKED);
  const [isFlashcardSet] = useEntityHasTags(entity, DataTypes.FLASHCARD_SET);
  const [isSubtopic] = useEntityHasTags(entity, DataTypes.SUBTOPIC);
  const [isNote] = useEntityHasTags(entity, DataTypes.NOTE);
  const [isFlashcard] = useEntityHasTags(entity, DataTypes.FLASHCARD);
  const id = entity.get(IdentifierFacet)?.props.guid;

  const toggleBookmark = async () => {
    if (id) {
      if (isBookmarked) {
        entity.removeTag(AdditionalTags.BOOKMARKED);
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
        entity.addTag(AdditionalTags.BOOKMARKED);
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
