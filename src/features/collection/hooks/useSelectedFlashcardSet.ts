import {  useEntity } from "@leanscope/ecs-engine";
import { dataTypeQuery } from "../../../utils/queries";
import { DataTypes } from "../../../base/enums";
import { IdentifierFacet, ParentFacet, Tags } from "@leanscope/ecs-models";
import { TitleFacet } from "../../../app/additionalFacets";

export const useSelectedFlashcardSet = () => {
  const [selectedFlashcardSetEntity] = useEntity(
    (e) => dataTypeQuery(e, DataTypes.FLASHCARD_SET) && e.hasTag(Tags.SELECTED)
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
