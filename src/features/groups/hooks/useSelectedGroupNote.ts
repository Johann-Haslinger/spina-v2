import { useEntity } from '@leanscope/ecs-engine';
import { Tags, IdentifierFacet, TextFacet, ParentFacet } from '@leanscope/ecs-models';
import { TitleFacet } from '../../../app/additionalFacets';
import { DataTypes } from '../../../base/enums';
import { dataTypeQuery } from '../../../utils/queries';

export const useSelectedGroupNote = () => {
  const [selectedGroupNoteEntity] = useEntity((e) => dataTypeQuery(e, DataTypes.GROUP_NOTE) && e.hasTag(Tags.SELECTED));
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
