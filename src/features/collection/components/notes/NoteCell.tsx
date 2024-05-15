import { TitleProps } from "../../../../app/a";
import { EntityProps } from "@leanscope/ecs-engine";
import { Tags } from "@leanscope/ecs-models";
import { useSelectedSchoolSubjectColor } from "../../hooks/useSelectedSchoolSubjectColor";
import { NoteThumbNail } from "../../../../components";


const NoteCell = (props: TitleProps & EntityProps) => {
  const { title, entity } = props;
  const { backgroundColor } = useSelectedSchoolSubjectColor();

  const openNote = () => {
    entity.addTag(Tags.SELECTED);
  };

  return (
    <NoteThumbNail onClick={openNote} color={backgroundColor} title={title} />
  );
};

export default NoteCell;
