import { useEntity } from "@leanscope/ecs-engine";
import { Tags, IdentifierFacet, ParentFacet } from "@leanscope/ecs-models";
import { TitleFacet } from "../../../app/additionalFacets";
import { DataTypes } from "../../../base/enums";
import { dataTypeQuery } from "../../../utils/queries";

export const useSelectedGroupFlashcardSet = () => {
  const [selectedGroupFlashcardSetEntity] = useEntity(
    (e) =>
      dataTypeQuery(e, DataTypes.GROUP_FLASHCARD_SET) &&
      e.hasTag(Tags.SELECTED),
  );
  const selectedGroupFlashcardSetTitle =
    selectedGroupFlashcardSetEntity?.get(TitleFacet)?.props.title;
  const selectedGroupFlashcardSetId =
    selectedGroupFlashcardSetEntity?.get(IdentifierFacet)?.props.guid;
  const selectedGroupFlashcardSetParentId =
    selectedGroupFlashcardSetEntity?.get(ParentFacet)?.props.parentId;

  return {
    selectedGroupFlashcardSetEntity,
    selectedGroupFlashcardSetTitle,
    selectedGroupFlashcardSetId,
    selectedGroupFlashcardSetParentId,
  };
};
