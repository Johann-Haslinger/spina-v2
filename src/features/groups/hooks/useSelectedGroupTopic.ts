import { useEntity } from '@leanscope/ecs-engine';
import { DescriptionFacet, IdentifierFacet, Tags } from '@leanscope/ecs-models';
import { TitleFacet } from '../../../base/additionalFacets';
import { DataType } from '../../../base/enums';
import { dataTypeQuery } from '../../../common/utilities/queries';

export const useSelectedGroupTopic = () => {
  const [selectedGroupTopicEntity] = useEntity(
    (e) => dataTypeQuery(e, DataType.GROUP_TOPIC) && e.hasTag(Tags.SELECTED),
  );
  const selectedGroupTopicId = selectedGroupTopicEntity?.get(IdentifierFacet)?.props.guid;
  const selectedGroupTopicTitle = selectedGroupTopicEntity?.get(TitleFacet)?.props.title;
  const selectedGroupTopicDescription = selectedGroupTopicEntity?.get(DescriptionFacet)?.props.description;

  return {
    selectedGroupTopicEntity,
    selectedGroupTopicTitle,
    selectedGroupTopicId,
    selectedGroupTopicDescription,
  };
};
