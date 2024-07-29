import { useEntities } from "@leanscope/ecs-engine";
import { dataTypeQuery } from "../../../utils/queries";
import { DataTypes } from "../../../base/enums";

export const useFlashcardGroups = () => {
  const [flashcardGroupEntities] = useEntities((e) =>
    dataTypeQuery(e, DataTypes.FLASHCARD_GROUP),
  );
  const existFlashcardGroups = flashcardGroupEntities.length > 0;

  return {
    flashcardGroupEntities,
    existFlashcardGroups,
  };
};
