import { useEntity } from '@leanscope/ecs-engine';
import { IdentifierFacet, Tags, TextFacet } from '@leanscope/ecs-models';
import { DueDateFacet, TitleFacet } from '../../../app/additionalFacets';
import { DataTypes } from '../../../base/enums';
import { dataTypeQuery } from '../../../utils/queries';

export const useSelectedHomework = () => {
  const [selectedHomeworkEntity] = useEntity((e) => dataTypeQuery(e, DataTypes.HOMEWORK) && e.hasTag(Tags.SELECTED));

  const selectedHomeworkTitle = selectedHomeworkEntity?.get(TitleFacet)?.props.title;
  const selectedHomeworkId = selectedHomeworkEntity?.get(IdentifierFacet)?.props.guid;
  const selectedHomeworkDueDate = selectedHomeworkEntity?.get(DueDateFacet)?.props.dueDate;
  const selectedHomeworkText = selectedHomeworkEntity?.get(TextFacet)?.props.text;

  return {
    selectedHomeworkEntity,
    selectedHomeworkTitle,
    selectedHomeworkId,
    selectedHomeworkDueDate,
    selectedHomeworkText,
  };
};
