import { useEntity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet, Tags } from '@leanscope/ecs-models';
import { TitleFacet } from '../../../base/additionalFacets';
import { DataType } from '../../../base/enums';
import { dataTypeQuery } from '../../../common/utilities/queries';

export const useSelectedFlashcardSet = () => {
  const [selectedFlashcardSetEntity] = useEntity(
    (e) => dataTypeQuery(e, DataType.FLASHCARD_SET) && e.hasTag(Tags.SELECTED),
  );
  const selectedFlashcardSetTitle = selectedFlashcardSetEntity?.get(TitleFacet)?.props.title;
  const selectedFlashcardSetId = selectedFlashcardSetEntity?.get(IdentifierFacet)?.props.guid;
  const selectedFlashcardSetParentId = selectedFlashcardSetEntity?.get(ParentFacet)?.props.parentId;

  return {
    selectedFlashcardSetEntity,
    selectedFlashcardSetTitle,
    selectedFlashcardSetId,
    selectedFlashcardSetParentId,
  };
};
