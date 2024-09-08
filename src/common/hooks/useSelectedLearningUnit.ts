import { useEntity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet, Tags } from '@leanscope/ecs-models';
import { TitleFacet } from '../../app/additionalFacets';
import { DataType } from '../../base/enums';
import { dataTypeQuery } from '../../utils/queries';

export const useSelectedLearningUnit = () => {
  const [selectedLearningUnitEntity] = useEntity(
    (e) => dataTypeQuery(e, DataType.LEARNING_UNIT) && e.hasTag(Tags.SELECTED),
  );

  const selectedLearningUnitId = selectedLearningUnitEntity?.get(IdentifierFacet)?.props.guid;
  const selectedLearningUnitTitle = selectedLearningUnitEntity?.get(TitleFacet)?.props.title;
  const selectedLearningUnitParentId = selectedLearningUnitEntity?.get(ParentFacet)?.props.parentId;

  return { selectedLearningUnitId, selectedLearningUnitTitle, selectedLearningUnitParentId };
};
