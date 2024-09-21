import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { EntityPropsMapper } from '@leanscope/ecs-engine';
import { IdentifierFacet, TextFacet } from '@leanscope/ecs-models';
import { useContext } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import tw from 'twin.macro';
import { TitleFacet } from '../../../../app/additionalFacets';
import { grid2 } from '../../../../assets';
import { AdditionalTag, DataType, LearningUnitType, Story } from '../../../../base/enums';
import { CollectionGrid, NavigationBar, SecondaryText, Spacer, Title, View } from '../../../../components';
import { useIsAnyStoryCurrent } from '../../../../hooks/useIsAnyStoryCurrent';
import { useWindowDimensions } from '../../../../hooks/useWindowDimensions';
import { dataTypeQuery, learningUnitTypeQuery } from '../../../../utils/queries';
import { sortEntitiesByDateAdded } from '../../../../utils/sortEntitiesByTime';
import InitializeBookmarkedResources from '../../systems/InitializeBookmarkedResources';
import HomeworkCell from '../homeworks/HomeworkCell';
import LearningUnitCell from '../learning_units/LearningUnitCell';
import BookmarkedFlashcardsCell from './BookmarkedFlashcardsCell';
import BookmarkedFlashcardsView from './BookmarkedFlashcardsView';

const StyledTopAreaWrapper = styled.div<{ image: string; grid: boolean }>`
  ${tw`w-full  top-0 z-0 mt-14 xl:mt-0  bg-cover  xl:bg-fixed h-64 md:h-[16rem] xl:h-96 2xl:h-[24rem]  flex`}
  background-image: ${({ image }) => `url(${image})`};
`;

const StyledTopicResourcesWrapper = styled.div<{ largeShadow: boolean }>`
  ${tw` px-4  md:px-20 h-fit min-h-screen     pt-10 pb-40  dark:bg-primary-dark transition-all   bg-primary  lg:px-32 xl:px-60 2xl:px-96 w-full`}
  ${({ largeShadow }) =>
    largeShadow
      ? tw`shadow-[0px_0px_60px_0px_rgba(0, 0, 0, 0.6)] xl:shadow-[0px_0px_60px_0px_rgba(0, 0, 0, 0.5)] `
      : tw`shadow-[0px_0px_20px_0px_rgba(0, 0, 0, 0.1)]  `}
`;

const StyledNavbarBackground = styled.div`
  ${tw`w-full xl:h-0 h-14 bg-primary  absolute top-0 left-0 dark:bg-primary-dark`}
`;

const StyledImageOverlay = styled.div<{ overlay?: string }>`
  ${tw`w-full  flex flex-col justify-end h-full overflow-visible`}
  ${({ overlay }) => overlay && tw`bg-black  bg-opacity-30  `}
`;

const StyledBackButton = styled.div`
  ${tw` size-10  relative top-5 transition-all md:hover:scale-105 text-2xl ml-4 md:ml-20 lg:ml-32 xl:ml-60 2xl:ml-96 dark:bg-tertiary-dark dark:text-white bg-tertiary  text-black rounded-full flex justify-center items-center`}
`;

const StyledTopicViewContainer = styled.div`
  ${tw`w-full overflow-x-hidden h-full`}
`;

const BookmarksView = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsAnyStoryCurrent([
    Story.OBSERVING_BOOKMARKS_STORY,
    Story.OBSERVING_BOOKMARKED_FLASHCARDS_STORY,
  ]);
  const { width } = useWindowDimensions();

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_COLLECTION_STORY);

  return (
    <div>
      <InitializeBookmarkedResources />

      <View hidePadding visible={isVisible}>
        <StyledTopicViewContainer>
          <StyledNavbarBackground />
          <NavigationBar white={scrollY < 360 && width > 1280} tw="bg-black" />
          <StyledTopAreaWrapper grid image={grid2}>
            <StyledImageOverlay>
              <StyledBackButton onClick={navigateBack}>
                <IoArrowBack />
              </StyledBackButton>
            </StyledImageOverlay>
          </StyledTopAreaWrapper>

          <StyledTopicResourcesWrapper largeShadow={false}>
            <div tw="h-fit w-full">
              <Spacer />
              <Title>Lesezeichen</Title>
              <div tw="md:w-4/5 ">
                <SecondaryText>Hier findest du alle Lerninhalte, die du als Lesezeichen markiert hast.</SecondaryText>
              </div>
              <Spacer size={8} />
            </div>

            <CollectionGrid columnSize="small">
              <EntityPropsMapper
                query={(e) => learningUnitTypeQuery(e, LearningUnitType.MIXED) && e.has(AdditionalTag.BOOKMARKED)}
                sort={(a, b) => sortEntitiesByDateAdded(a, b)}
                get={[[TitleFacet], []]}
                onMatch={LearningUnitCell}
              />
            </CollectionGrid>

            <CollectionGrid columnSize="small">
              <EntityPropsMapper
                query={(e) => learningUnitTypeQuery(e, LearningUnitType.NOTE) && e.has(AdditionalTag.BOOKMARKED)}
                sort={(a, b) => sortEntitiesByDateAdded(a, b)}
                get={[[TitleFacet], []]}
                onMatch={LearningUnitCell}
              />
            </CollectionGrid>

            <CollectionGrid columnSize="small">
              <BookmarkedFlashcardsCell />
              <EntityPropsMapper
                query={(e) =>
                  learningUnitTypeQuery(e, LearningUnitType.FLASHCARD_SET) && e.has(AdditionalTag.BOOKMARKED)
                }
                get={[[TitleFacet, IdentifierFacet], []]}
                sort={(a, b) => sortEntitiesByDateAdded(a, b)}
                onMatch={LearningUnitCell}
              />
            </CollectionGrid>

            <CollectionGrid columnSize="small">
              <EntityPropsMapper
                query={(e) => dataTypeQuery(e, DataType.HOMEWORK) && e.has(AdditionalTag.BOOKMARKED)}
                get={[[TitleFacet, TextFacet, IdentifierFacet], []]}
                sort={(a, b) => sortEntitiesByDateAdded(a, b)}
                onMatch={HomeworkCell}
              />
            </CollectionGrid>
          </StyledTopicResourcesWrapper>
        </StyledTopicViewContainer>
      </View>

      <BookmarkedFlashcardsView />
    </div>
  );
};

export default BookmarksView;
