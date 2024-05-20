import { EntityProps } from "@leanscope/ecs-engine";
import { Tags } from "@leanscope/ecs-models";
import { TitleProps } from "../../../../app/additionalFacets";
import { NoteThumbNail } from "../../../../components";
import { useSelectedSchoolSubjectColor } from "../../hooks/useSelectedSchoolSubjectColor";

const HomeworkCell = (props: TitleProps & EntityProps) => {
  const { title, entity } = props;
  const { backgroundColor } = useSelectedSchoolSubjectColor();

  const openHomework = () => entity.addTag(Tags.SELECTED);

  return <NoteThumbNail color={backgroundColor} title={title} onClick={openHomework} type={"Hausaufgabe"} />;
};

export default HomeworkCell;
