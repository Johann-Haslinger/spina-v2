import { useEntity } from '@leanscope/ecs-engine';
import { ColorFacet, DescriptionFacet, IdentifierFacet, Tags } from '@leanscope/ecs-models';
import { TitleFacet } from '../../../base/additionalFacets';
import { DataType } from '../../../base/enums';

export const useSelectedLearningGroup = () => {
  const [selectedLearningGroupEntity] = useEntity((e) => e.has(DataType.LEARNING_GROUP) && e.has(Tags.SELECTED));

  const selectedLearningGroupTitle = selectedLearningGroupEntity?.get(TitleFacet)?.props.title;
  const selectedLearningGroupColor = selectedLearningGroupEntity?.get(ColorFacet)?.props.colorName;
  const selectedLearningGroupId = selectedLearningGroupEntity?.get(IdentifierFacet)?.props.guid;
  const selectedLearningGroupDescription = selectedLearningGroupEntity?.get(DescriptionFacet)?.props.description || '';

  return {
    selectedLearningGroupEntity,
    selectedLearningGroupTitle,
    selectedLearningGroupColor,
    selectedLearningGroupId,
    selectedLearningGroupDescription,
  };
};
