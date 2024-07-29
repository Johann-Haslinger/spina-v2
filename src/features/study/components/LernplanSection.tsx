import styled from "@emotion/styled";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { EntityProps, EntityPropsMapper } from "@leanscope/ecs-engine";
import { useContext } from "react";
import { IoPlay } from "react-icons/io5";
import tw from "twin.macro";
import {
  DateAddedFacet,
  DateAddedProps,
  TitleFacet,
  TitleProps,
} from "../../../app/additionalFacets";
import { AdditionalTags, DataTypes, Stories } from "../../../base/enums";
import { sortEntitiesByDateAdded } from "../../../utils/sortEntitiesByTime";
import { useBookmarkedFlashcardGroups } from "../hooks/useBookmarkedFlashcardGroups";
import FlashcardGroupCell from "./FlashcardGroupCell";
import { COLOR_ITEMS } from "../../../base/constants";

const StyledLernplanSectionWrapper = styled.div`
  ${tw`w-full mb-2  space-y-2 md:space-y-0 md:space-x-2 md:flex    transition-all `}
`;
const StyledFlashcardGroupWrapper = styled.div`
  ${tw`md:w-3/4 w-full rounded-lg  flex flex-shrink-0  overflow-x-scroll`}
  background-color: ${COLOR_ITEMS[3].accentColor};
`;

const StyledPlayIconContainer = styled.div`
  ${tw`md:w-1/4 w-full h-40 rounded-lg   flex items-center justify-center `}
  background-color: ${COLOR_ITEMS[3].accentColor};
`;

const StyledPlayIconWrapper = styled.div`
  ${tw`text-6xl md:hover:opacity-50 transition-all rounded-full bg-white text-white p-4  bg-opacity-20 `}
`;

const LernplanSection = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { bookmarkedGroupsExist } = useBookmarkedFlashcardGroups();

  const openBookmarkedFlashcardGroupQuiz = () =>
    lsc.stories.transitTo(
      Stories.OBSERVING_BOOKMARKED_FLASHCARD_GROUP_QUIZ_STORY,
    );

  return (
    bookmarkedGroupsExist && (
      <StyledLernplanSectionWrapper>
        <StyledFlashcardGroupWrapper>
          <EntityPropsMapper
            query={(e) =>
              e.has(DataTypes.FLASHCARD_GROUP) &&
              e.has(AdditionalTags.BOOKMARKED)
            }
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
  ${tw`w-full min-w-64 md:hover:scale-[0.91] transition-all h-40`}
`;

const LernplanFlashcardGroupCell = (
  props: TitleProps & EntityProps & DateAddedProps,
) => (
  <StyledFlashcardGroupCellContainer>
    <StyledFlashcardGroupCellWrapper>
      <FlashcardGroupCell {...props} />
    </StyledFlashcardGroupCellWrapper>
  </StyledFlashcardGroupCellContainer>
);
