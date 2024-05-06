import styled from "@emotion/styled";
import { EntityProps, EntityPropsMapper } from "@leanscope/ecs-engine";
import tw from "twin.macro";
import { DataTypes } from "../../../base/enums";
import { TitleFacet, DateAddedFacet, DateAddedProps, TitleProps } from "../../../app/AdditionalFacets";
import FlashcardGroupCell from "./FlashcardGroupCell";

const StyledLernplanSectionWrapper = styled.div`
  ${tw`w-full h-60 p-3  bg-white dark:bg-tertiaryDark transition-all `}
`;
const StyledFlashcardGroupWrapper = styled.div`
  ${tw`w-full flex flex-shrink-0   overflow-x-scroll`}
`;

const StyledLernplanInfoWrapper = styled.div`
  ${tw`w-80 h-60 p-3 `}
`;

const LernplanSection = () => {
  return (
    <StyledLernplanSectionWrapper>
      <StyledFlashcardGroupWrapper>
        <EntityPropsMapper
          query={(e) => e.has(DataTypes.FLASHCARD_GROUP)}
          get={[[TitleFacet, DateAddedFacet], []]}
          onMatch={LernplanFlashcardGroupCell}
        />
      </StyledFlashcardGroupWrapper>
      <StyledLernplanInfoWrapper>
        <h1>Info</h1>
      </StyledLernplanInfoWrapper>
    </StyledLernplanSectionWrapper>
  );
};

export default LernplanSection;

const StyledFlashcardGroupCellContainer = styled.div`
  ${tw` w-64 mx-1`}
`;

const StyledFlashcardGroupCellWrapper = styled.div`
  ${tw` w-64 h-40`}
`;

const LernplanFlashcardGroupCell = (props: TitleProps & EntityProps & DateAddedProps) => (
  <StyledFlashcardGroupCellContainer>
    <StyledFlashcardGroupCellWrapper>
      <FlashcardGroupCell {...props} />
    </StyledFlashcardGroupCellWrapper>
  </StyledFlashcardGroupCellContainer>
);
