import { useEntities } from '@leanscope/ecs-engine';
import { DataType } from '../../../base/enums';
import { dataTypeQuery } from '../../../utils/queries';

export const useFlashcardGroups = () => {
  const [flashcardGroupEntities] = useEntities((e) => dataTypeQuery(e, DataType.FLASHCARD_GROUP));
  const existFlashcardGroups = flashcardGroupEntities.length > 0;

  return {
    flashcardGroupEntities,
    existFlashcardGroups,
  };
};
