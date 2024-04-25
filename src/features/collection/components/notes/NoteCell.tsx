import tw from "twin.macro";
import { TitleProps } from "../../../../app/AdditionalFacets";
import { EntityProps } from "@leanscope/ecs-engine";
import styled from "@emotion/styled";
import { Tags } from "@leanscope/ecs-models";

const StyledNoteCellWrapper = styled.div`
  ${tw`bg-black h-40 w-full text-white hover:scale-105 transition-all `}
`;

const NoteCell = (props: TitleProps & EntityProps) => {
  const { title, entity } = props;

  const openNote = () => {
    entity.addTag(Tags.SELECTED)
  }

  return <StyledNoteCellWrapper onClick={openNote}>{title}</StyledNoteCellWrapper>;
};

export default NoteCell;
