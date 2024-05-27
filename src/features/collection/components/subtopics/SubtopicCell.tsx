import { EntityProps } from "@leanscope/ecs-engine";
import { Tags } from "@leanscope/ecs-models";
import { TitleProps } from "../../../../app/additionalFacets";
import SubtopicThumbNail from "../../../../components/thumb-nails/SubtopicThumbNail";
import { useSelectedSchoolSubjectColor } from "../../hooks/useSelectedSchoolSubjectColor";

const SubtopicCell = (props: EntityProps & TitleProps) => {
  const { title, entity } = props;
  const { accentColor } = useSelectedSchoolSubjectColor();

  const openSubtopicView = () => entity.add(Tags.SELECTED);

  return <SubtopicThumbNail color={accentColor} title={title} onClick={openSubtopicView} />;
};

export default SubtopicCell;
