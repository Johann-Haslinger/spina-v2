import styled from "@emotion/styled";
import { EntityProps, EntityPropsMapper } from "@leanscope/ecs-engine";
import tw from "twin.macro";
import { AdditionalTags, DataTypes, Stories } from "../../../base/enums";
import { TitleFacet, DateAddedFacet, DateAddedProps, TitleProps } from "../../../app/AdditionalFacets";
import FlashcardGroupCell from "./FlashcardGroupCell";
import { IoPlay } from "react-icons/io5";
import { useBookmarkedFlashcardGroups } from "../hooks/useBookmarkedFlashcardGroups";
import { sortEntitiesByDateAdded } from "../../../utils/sortEntitiesByTime";
import { useContext } from "react";
import { LeanScopeClientContext } from "@leanscope/api-client/node";

const StyledLernplanSectionWrapper = styled.div`
  ${tw`w-full mb-2 h-40 space-x-2 flex    transition-all `}
`;
const StyledFlashcardGroupWrapper = styled.div`
  ${tw`w-3/4 rounded-lg  flex flex-shrink-0  overflow-x-scroll`}
  background-color: #00965F;
`;

const StyledPlayIconContainer = styled.div`
  ${tw`w-1/4 h-full rounded-lg   flex items-center justify-center `}
  background-color: #00965F;
`;

const StyledPlayIconWrapper = styled.div`
  ${tw`text-6xl hover:opacity-50 transition-all rounded-full bg-white text-white p-4  bg-opacity-20 `}
`;

const LernplanSection = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { bookmarkedGroupsExist } = useBookmarkedFlashcardGroups();

  const openBookmarkedFlashcardGroupQuiz = () => lsc.stories.transitTo(Stories.OBSERVING_BOOKMARKED_FLASHCARD_GROUP_QUIZ_STORY);

  return (
    bookmarkedGroupsExist && (
      <StyledLernplanSectionWrapper>
        <StyledFlashcardGroupWrapper>
          <EntityPropsMapper
            query={(e) => e.has(DataTypes.FLASHCARD_GROUP) && e.has(AdditionalTags.BOOKMARKED)}
            sort={sortEntitiesByDateAdded}
            get={[[TitleFacet, DateAddedFacet], []]}
            onMatch={LernplanFlashcardGroupCell}
          />
        </StyledFlashcardGroupWrapper>
        <StyledPlayIconContainer onClick={openBookmarkedFlashcardGroupQuiz}>
          <StyledPlayIconWrapper>
            <IoPlay />
          </StyledPlayIconWrapper>
        </StyledPlayIconContainer>
      </StyledLernplanSectionWrapper>
    )
  );
};

export default LernplanSection;

const StyledFlashcardGroupCellContainer = styled.div`
  ${tw` w-full`}
`;

const StyledFlashcardGroupCellWrapper = styled.div`
  ${tw`w-full min-w-64 hover:scale-[0.91] transition-all h-40`}
`;

const LernplanFlashcardGroupCell = (props: TitleProps & EntityProps & DateAddedProps) => (
  <StyledFlashcardGroupCellContainer>
    <StyledFlashcardGroupCellWrapper>
      <FlashcardGroupCell {...props} />
    </StyledFlashcardGroupCellWrapper>
  </StyledFlashcardGroupCellContainer>
);
