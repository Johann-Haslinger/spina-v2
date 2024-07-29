import { useEntities } from "@leanscope/ecs-engine";
import { dataTypeQuery } from "../../../utils/queries";
import { DataTypes, AdditionalTags } from "../../../base/enums";

export const useBookmarkedFlashcardGroups = () => {
  const [bookmarkedFlashcardGroupEntities] = useEntities(
    (e) =>
      dataTypeQuery(e, DataTypes.FLASHCARD_GROUP) &&
      e.has(AdditionalTags.BOOKMARKED),
  );
  const bookmarkedGroupsExist = bookmarkedFlashcardGroupEntities.length > 0;

  return { bookmarkedFlashcardGroupEntities, bookmarkedGroupsExist };
};
