import tw from "twin.macro";
import { TitleProps } from "../../../../app/AdditionalFacets";
import { EntityProps } from "@leanscope/ecs-engine";
import styled from "@emotion/styled";
import { Tags } from "@leanscope/ecs-models";
import { useSelectedSchoolSubjectColor } from "../../hooks/useSelectedSchoolSubjectColor";
import { NoteThumbNail } from "../../../../components";


const NoteCell = (props: TitleProps & EntityProps) => {
  const { title, entity } = props;
  const { backgroundColor, color } = useSelectedSchoolSubjectColor();

  const openNote = () => {
    entity.addTag(Tags.SELECTED);
  };

  return (
    <NoteThumbNail onClick={openNote} color={backgroundColor} title={title} />
  );
};

export default NoteCell;
