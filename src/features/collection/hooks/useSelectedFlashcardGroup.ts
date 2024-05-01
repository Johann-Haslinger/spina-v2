import { useSelectedFlashcardSet } from "./useSelectedFlashcardSet";
import { useSelectedSubtopic } from "./useSelectedSubtopic";

export const useSeletedFlashcardGroup = () => {
  const { selectedFlashcardSetId, selectedFlashcardSetEntity, selectedFlashcardSetTitle } = useSelectedFlashcardSet();
  const { selectedSubtopicId, selectedSubtopicEntity, selectedSubtopicTitle } = useSelectedSubtopic();

  const selectedFlashcardGroupEntity = selectedFlashcardSetEntity || selectedSubtopicEntity;
  const selectedFlashcardGroupId = selectedFlashcardSetId || selectedSubtopicId;
  const selectedFlashcardGroupTitle = selectedFlashcardSetTitle || selectedSubtopicTitle;

  return { selectedFlashcardGroupEntity, selectedFlashcardGroupId, selectedFlashcardGroupTitle };
};
