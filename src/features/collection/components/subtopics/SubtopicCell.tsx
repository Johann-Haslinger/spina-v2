import { EntityProps } from "@leanscope/ecs-engine";
import { TitleProps } from "../../../../app/AdditionalFacets";
import { Tags } from "@leanscope/ecs-models";
import SubtopicThumbNail from "../../../../components/thumbNails/SubtopicThumbNail";
import { useSelectedSchoolSubjectColor } from "../../hooks/useSelectedSchoolSubjectColor";

const SubtopicCell = (props: EntityProps & TitleProps) => {
  const { title, entity } = props;
  const {backgroundColor} = useSelectedSchoolSubjectColor()

  const openSubtopicView = () => entity.add(Tags.SELECTED)

  return <SubtopicThumbNail color={backgroundColor} title={title} onClick={openSubtopicView} />;
};

export default SubtopicCell;
