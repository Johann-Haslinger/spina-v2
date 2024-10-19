import { useEntity } from '@leanscope/ecs-engine';
import { IdentifierFacet, Tags, TextFacet } from '@leanscope/ecs-models';
import { TitleFacet } from '../../../common/types/additionalFacets';
import { DataType } from '../../../common/types/enums';
import { dataTypeQuery } from '../../../common/utilities/queries';

export const useSelectedSubtopic = () => {
  const [selectedSubtopicEntity] = useEntity((e) => dataTypeQuery(e, DataType.SUBTOPIC) && e.hasTag(Tags.SELECTED));
  const selectedSubtopicTitle = selectedSubtopicEntity?.get(TitleFacet)?.props.title;
  const selectedSubtopicId = selectedSubtopicEntity?.get(IdentifierFacet)?.props.guid;
  const selectedSubtopicText = selectedSubtopicEntity?.get(TextFacet)?.props.text;

  return {
    selectedSubtopicEntity,
    selectedSubtopicTitle,
    selectedSubtopicId,
    selectedSubtopicText,
  };
};
