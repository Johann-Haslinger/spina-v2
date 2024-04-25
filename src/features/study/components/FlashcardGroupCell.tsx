import { Tags } from "@leanscope/ecs-models";
import { TitleProps } from "../../../app/AdditionalFacets";
import { EntityProps } from "@leanscope/ecs-engine";
import styled from "@emotion/styled/macro";
import tw from "twin.macro";

const StyledFlashcardGroupCellWrapper = styled.div`
  ${tw`w-full h-40  transition-all hover:scale-105 bg-black`}
`;
const StyledFlashcardGroupCellTitle = styled.div`
  ${tw`text-white text-center`}
`;
const FlashcardGroupCell = (props: TitleProps & EntityProps) => {
  const { title, entity } = props;

  const openFlashcardGroup = () => entity.add(Tags.SELECTED);

  return (
    <StyledFlashcardGroupCellWrapper onClick={openFlashcardGroup}>
      <StyledFlashcardGroupCellTitle>{title}</StyledFlashcardGroupCellTitle>
    </StyledFlashcardGroupCellWrapper>
  );
};

export default FlashcardGroupCell;
