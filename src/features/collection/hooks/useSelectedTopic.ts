import { useEntity } from '@leanscope/ecs-engine';
import { DescriptionFacet, IdentifierFacet, Tags } from '@leanscope/ecs-models';
import { TitleFacet } from '../../../common/types/additionalFacets';
import { DataType } from '../../../common/types/enums';
import { dataTypeQuery } from '../../../common/utilities/queries';

export const useSelectedTopic = () => {
  const [selectedTopicEntity] = useEntity((e) => dataTypeQuery(e, DataType.TOPIC) && e.hasTag(Tags.SELECTED));
  const selectedTopicId = selectedTopicEntity?.get(IdentifierFacet)?.props.guid;
  const selectedTopicTitle = selectedTopicEntity?.get(TitleFacet)?.props.title;
  const selectedTopicDescription = selectedTopicEntity?.get(DescriptionFacet)?.props.description;

  return {
    selectedTopicEntity,
    selectedTopicTitle,
    selectedTopicId,
    selectedTopicDescription,
  };
};
