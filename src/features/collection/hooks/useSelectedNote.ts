import { useEntity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet, Tags, TextFacet } from '@leanscope/ecs-models';
import { TitleFacet } from '../../../common/types/additionalFacets';
import { DataType } from '../../../common/types/enums';
import { dataTypeQuery } from '../../../common/utilities/queries';

export const useSelectedNote = () => {
  const [selectedNoteEntity] = useEntity((e) => dataTypeQuery(e, DataType.NOTE) && e.hasTag(Tags.SELECTED));
  const selectedNoteTitle = selectedNoteEntity?.get(TitleFacet)?.props.title;
  const selectedNoteId = selectedNoteEntity?.get(IdentifierFacet)?.props.guid;
  const selectedNoteText = selectedNoteEntity?.get(TextFacet)?.props.text;
  const selectedNoteParentId = selectedNoteEntity?.get(ParentFacet)?.props.parentId;

  return {
    selectedNoteEntity,
    selectedNoteTitle,
    selectedNoteText,
    selectedNoteId,
    selectedNoteParentId,
  };
};
