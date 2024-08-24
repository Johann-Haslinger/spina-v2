import { useEntity } from '@leanscope/ecs-engine';
import { IdentifierFacet, Tags } from '@leanscope/ecs-models';
import { DueDateFacet, TitleFacet } from '../../../app/additionalFacets';
import { DataType } from '../../../base/enums';
import { dataTypeQuery } from '../../../utils/queries';

export const useSelectedExam = () => {
  const [selectedExamEntity] = useEntity((e) => e.has(Tags.SELECTED) && dataTypeQuery(e, DataType.EXAM));

  const selectedExamId = selectedExamEntity?.get(IdentifierFacet)?.props.guid;
  const selectedExamTitle = selectedExamEntity?.get(TitleFacet)?.props.title;
  const selectedExamDueDate = selectedExamEntity?.get(DueDateFacet)?.props.dueDate;

  return {
    selectedExamEntity,
    selectedExamId,
    selectedExamTitle,
    selectedExamDueDate,
  };
};
