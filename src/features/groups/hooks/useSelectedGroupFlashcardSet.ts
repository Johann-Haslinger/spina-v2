import { useEntity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet, Tags } from '@leanscope/ecs-models';
import { TitleFacet } from '../../../base/additionalFacets';
import { DataType } from '../../../base/enums';
import { dataTypeQuery } from '../../../common/utilities/queries';

export const useSelectedGroupFlashcardSet = () => {
  const [selectedGroupFlashcardSetEntity] = useEntity(
    (e) => dataTypeQuery(e, DataType.GROUP_FLASHCARD_SET) && e.hasTag(Tags.SELECTED),
  );
  const selectedGroupFlashcardSetTitle = selectedGroupFlashcardSetEntity?.get(TitleFacet)?.props.title;
  const selectedGroupFlashcardSetId = selectedGroupFlashcardSetEntity?.get(IdentifierFacet)?.props.guid;
  const selectedGroupFlashcardSetParentId = selectedGroupFlashcardSetEntity?.get(ParentFacet)?.props.parentId;

  return {
    selectedGroupFlashcardSetEntity,
    selectedGroupFlashcardSetTitle,
    selectedGroupFlashcardSetId,
    selectedGroupFlashcardSetParentId,
  };
};
