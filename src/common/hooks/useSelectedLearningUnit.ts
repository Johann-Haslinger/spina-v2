import { useEntity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet, Tags, TextFacet } from '@leanscope/ecs-models';
import { LearningUnitTypeFacet, TitleFacet } from '../../base/additionalFacets';
import { DataType } from '../../base/enums';
import { dataTypeQuery } from '../utilities/queries';

export const useSelectedLearningUnit = () => {
  const [selectedLearningUnitEntity] = useEntity(
    (e) => dataTypeQuery(e, DataType.LEARNING_UNIT) && e.hasTag(Tags.SELECTED),
  );

  const selectedLearningUnitId = selectedLearningUnitEntity?.get(IdentifierFacet)?.props.guid;
  const selectedLearningUnitTitle = selectedLearningUnitEntity?.get(TitleFacet)?.props.title;
  const selectedLearningUnitParentId = selectedLearningUnitEntity?.get(ParentFacet)?.props.parentId;
  const selectedLearningUnitType = selectedLearningUnitEntity?.get(LearningUnitTypeFacet)?.props.type;
  const selectedLearningUnitText = selectedLearningUnitEntity?.get(TextFacet)?.props.text;

  return {
    selectedLearningUnitId,
    selectedLearningUnitTitle,
    selectedLearningUnitParentId,
    selectedLearningUnitType,
    selectedLearningUnitEntity,
    selectedLearningUnitText,
  };
};
