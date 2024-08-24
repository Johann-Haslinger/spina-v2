import { useEntity } from '@leanscope/ecs-engine';
import { IdentifierFacet, Tags, TextFacet } from '@leanscope/ecs-models';
import { DueDateFacet, TitleFacet } from '../../../app/additionalFacets';
import { DataType } from '../../../base/enums';
import { dataTypeQuery } from '../../../utils/queries';

export const useSelectedGroupHomework = () => {
  const [selectedGroupHomeworkEntity] = useEntity(
    (e) => dataTypeQuery(e, DataType.GROUP_HOMEWORK) && e.hasTag(Tags.SELECTED),
  );

  const selectedGroupHomeworkTitle = selectedGroupHomeworkEntity?.get(TitleFacet)?.props.title;
  const selectedGroupHomeworkId = selectedGroupHomeworkEntity?.get(IdentifierFacet)?.props.guid;
  const selectedGroupHomeworkDueDate = selectedGroupHomeworkEntity?.get(DueDateFacet)?.props.dueDate;
  const selectedGroupHomeworkText = selectedGroupHomeworkEntity?.get(TextFacet)?.props.text;

  return {
    selectedGroupHomeworkEntity,
    selectedGroupHomeworkTitle,
    selectedGroupHomeworkId,
    selectedGroupHomeworkDueDate,
    selectedGroupHomeworkText,
  };
};
