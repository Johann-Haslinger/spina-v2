import { useEntity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet, Tags, TextFacet } from '@leanscope/ecs-models';
import { TitleFacet } from '../../../common/types/additionalFacets';
import { DataType } from '../../../common/types/enums';
import { dataTypeQuery } from '../../../common/utilities/queries';

export const useSelectedGroupNote = () => {
  const [selectedGroupNoteEntity] = useEntity((e) => dataTypeQuery(e, DataType.GROUP_NOTE) && e.hasTag(Tags.SELECTED));
  const selectedGroupNoteTitle = selectedGroupNoteEntity?.get(TitleFacet)?.props.title;
  const selectedGroupNoteId = selectedGroupNoteEntity?.get(IdentifierFacet)?.props.guid;
  const selectedGroupNoteText = selectedGroupNoteEntity?.get(TextFacet)?.props.text;
  const selectedGroupNoteParentId = selectedGroupNoteEntity?.get(ParentFacet)?.props.parentId;

  return {
    selectedGroupNoteEntity,
    selectedGroupNoteTitle,
    selectedGroupNoteText,
    selectedGroupNoteId,
    selectedGroupNoteParentId,
  };
};
