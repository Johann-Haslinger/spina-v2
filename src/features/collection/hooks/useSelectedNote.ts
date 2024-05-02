import { useEntity } from "@leanscope/ecs-engine";
import { dataTypeQuery } from "../../../utils/queries";
import { DataTypes } from "../../../base/enums";
import { IdentifierFacet, ParentFacet, Tags, TextFacet } from "@leanscope/ecs-models";
import { TitleFacet } from "../../../app/AdditionalFacets";

export const useSelectedNote = () => {
  const [selectedNoteEntity] = useEntity(
    (e) => dataTypeQuery(e, DataTypes.NOTE) && e.hasTag(Tags.SELECTED)
  );
  const selectedNoteTitle = selectedNoteEntity?.get(TitleFacet)?.props.title;
  const selectedNoteId = selectedNoteEntity?.get(IdentifierFacet)?.props.guid;
  const selectedNoteText = selectedNoteEntity?.get(TextFacet)?.props.text;
  const selectedNoteParentId = selectedNoteEntity?.get(ParentFacet)?.props.parentId;

  return {
    selectedNoteEntity,
    selectedNoteTitle,
    selectedNoteText,
    selectedNoteId,
    selectedNoteParentId
  };
};
