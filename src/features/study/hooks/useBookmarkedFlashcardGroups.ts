import { useEntities } from '@leanscope/ecs-engine';
import { AdditionalTag, DataType } from '../../../base/enums';
import { dataTypeQuery } from '../../../utils/queries';

export const useBookmarkedFlashcardGroups = () => {
  const [bookmarkedFlashcardGroupEntities] = useEntities(
    (e) => dataTypeQuery(e, DataType.FLASHCARD_GROUP) && e.has(AdditionalTag.BOOKMARKED),
  );
  const bookmarkedGroupsExist = bookmarkedFlashcardGroupEntities.length > 0;

  return { bookmarkedFlashcardGroupEntities, bookmarkedGroupsExist };
};
