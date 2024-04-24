import { IdentifierProps, ParentProps, Tags } from "@leanscope/ecs-models";
import { TitleProps } from "../../../app/AdditionalFacets";
import { EntityProps } from "@leanscope/ecs-engine";
import styled from "@emotion/styled/macro";
import tw from "twin.macro";

const StyledFlashcardGroupCellContainer = styled.div`
  ${tw`flex items-center h-40  w-1/2 md:w-1/3 lg:w-1/4 justify-center p-1`}
`;

const StyledFlashcardGroupCellWrapper = styled.div`
  ${tw`w-full h-full transition-all hover:scale-105 bg-black`}
`;
const StyledFlashcardGroupCellTitle = styled.div`
  ${tw`text-white text-center`}
`;
const FlashcardGroupCell = (
  props:  TitleProps & EntityProps
) => {
  const { title, entity } = props;

  const openFlashcardGroup = () => entity.add(Tags.SELECTED)

  return (
    <StyledFlashcardGroupCellContainer onClick={openFlashcardGroup}>
      <StyledFlashcardGroupCellWrapper>
        <StyledFlashcardGroupCellTitle>{title}</StyledFlashcardGroupCellTitle>
      </StyledFlashcardGroupCellWrapper>
    </StyledFlashcardGroupCellContainer>
  );
};

export default FlashcardGroupCell;
