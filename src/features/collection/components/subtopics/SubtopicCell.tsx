import { EntityProps } from "@leanscope/ecs-engine";
import { TitleProps } from "../../../../app/a";
import { Tags } from "@leanscope/ecs-models";
import SubtopicThumbNail from "../../../../components/thumb-nails/SubtopicThumbNail";
import { useSelectedSchoolSubjectColor } from "../../hooks/useSelectedSchoolSubjectColor";

const SubtopicCell = (props: EntityProps & TitleProps) => {
  const { title, entity } = props;
  const {backgroundColor} = useSelectedSchoolSubjectColor()

  const openSubtopicView = () => entity.add(Tags.SELECTED)

  return <SubtopicThumbNail color={backgroundColor} title={title} onClick={openSubtopicView} />;
};

export default SubtopicCell;
