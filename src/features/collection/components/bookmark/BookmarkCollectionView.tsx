import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { EntityPropsMapper, useEntities } from '@leanscope/ecs-engine';
import { IdentifierFacet, Tags, TextFacet } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { Fragment, useContext } from 'react';
import {
  AnswerFacet,
  DateAddedFacet,
  MasteryLevelFacet,
  QuestionFacet,
  TitleFacet,
} from '../../../../app/additionalFacets';
import { AdditionalTags, DataType, Story } from '../../../../base/enums';
import {
  BackButton,
  CollectionGrid,
  NavigationBar,
  NoContentAddedHint,
  Spacer,
  Title,
  View,
} from '../../../../components';
import { useSelectedLanguage } from '../../../../hooks/useSelectedLanguage';
import { displayHeaderTexts } from '../../../../utils/displayText';
import { dataTypeQuery } from '../../../../utils/queries';
import { sortEntitiesByDateAdded } from '../../../../utils/sortEntitiesByTime';
import InitializeBookmarkedResourcesSystem from '../../systems/InitializeBookmarkedResourcesSystem';
import EditFlashcardSetSheet from '../flashcard-sets/EditFlashcardSetSheet';
import FlashcardCell from '../flashcard-sets/FlashcardCell';
import FlashcardSetCell from '../flashcard-sets/FlashcardSetCell';
import FlashcardSetView from '../flashcard-sets/FlashcardSetView';
import HomeworkCell from '../homeworks/HomeworkCell';
import HomeworkView from '../homeworks/HomeworkView';
import NoteCell from '../notes/NoteCell';
import NoteView from '../notes/NoteView';
import DeletePodcastAlert from '../podcasts/DeletePodcastAlert';
import PodcastRow from '../podcasts/PodcastRow';
import SubtopicCell from '../subtopics/SubtopicCell';
import SubtopicView from '../subtopics/SubtopicView';

const BookmarkCollectionView = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.OBSERVING_BOOKMARK_COLLECTION_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const [bookmarkedEntities] = useEntities((e) => e.has(AdditionalTags.BOOKMARKED));
  const [bookmarkedPodcasts] = useEntities(
    (e) => e.has(AdditionalTags.BOOKMARKED) && dataTypeQuery(e, DataType.PODCAST),
  );
  const [bookmarkedFlashcards] = useEntities(
    (e) => e.has(AdditionalTags.BOOKMARKED) && dataTypeQuery(e, DataType.FLASHCARD),
  );

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_COLLECTION_STORY);

  return (
    <Fragment>
      <InitializeBookmarkedResourcesSystem />

      <View visible={isVisible}>
        <NavigationBar />
        <BackButton navigateBack={navigateBack}>{displayHeaderTexts(selectedLanguage).collection}</BackButton>
        <Title>{displayHeaderTexts(selectedLanguage).bookmarkCollection}</Title>
        <Spacer />
        {bookmarkedEntities.length == 0 && <NoContentAddedHint />}

        <CollectionGrid>
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataType.SUBTOPIC) && e.has(AdditionalTags.BOOKMARKED)}
            sort={(a, b) => sortEntitiesByDateAdded(a, b)}
            get={[[TitleFacet], []]}
            onMatch={SubtopicCell}
          />
        </CollectionGrid>

        <CollectionGrid>
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataType.NOTE) && e.has(AdditionalTags.BOOKMARKED)}
            sort={(a, b) => sortEntitiesByDateAdded(a, b)}
            get={[[TitleFacet], []]}
            onMatch={NoteCell}
          />
        </CollectionGrid>

        <CollectionGrid>
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataType.FLASHCARD_SET) && e.has(AdditionalTags.BOOKMARKED)}
            get={[[TitleFacet, IdentifierFacet], []]}
            sort={(a, b) => sortEntitiesByDateAdded(a, b)}
            onMatch={FlashcardSetCell}
          />
        </CollectionGrid>

        <CollectionGrid>
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataType.HOMEWORK) && e.has(AdditionalTags.BOOKMARKED)}
            get={[[TitleFacet, TextFacet, IdentifierFacet], []]}
            sort={(a, b) => sortEntitiesByDateAdded(a, b)}
            onMatch={HomeworkCell}
          />
        </CollectionGrid>

        <Spacer size={8} />
        {bookmarkedFlashcards.length > 0 && (
          <Title size="small">{displayHeaderTexts(selectedLanguage).flashcards}</Title>
        )}
        <Spacer />
        <CollectionGrid columnSize="large">
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataType.FLASHCARD) && e.has(AdditionalTags.BOOKMARKED)}
            get={[[AnswerFacet, QuestionFacet, MasteryLevelFacet, IdentifierFacet], []]}
            onMatch={FlashcardCell}
          />
        </CollectionGrid>
        <Spacer size={8} />
        {bookmarkedPodcasts.length > 0 && <Title size="small">{displayHeaderTexts(selectedLanguage).podcasts}</Title>}
        <EntityPropsMapper
          query={(e) => dataTypeQuery(e, DataType.PODCAST) && e.has(AdditionalTags.BOOKMARKED)}
          get={[[TitleFacet, DateAddedFacet], []]}
          onMatch={PodcastRow}
        />
      </View>

      {isVisible && (
        <Fragment>
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataType.NOTE) && e.has(Tags.SELECTED)}
            get={[[TitleFacet, TextFacet, IdentifierFacet], []]}
            onMatch={NoteView}
          />
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataType.FLASHCARD_SET) && e.has(Tags.SELECTED)}
            get={[[TitleFacet, IdentifierFacet], []]}
            onMatch={FlashcardSetView}
          />
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataType.HOMEWORK) && e.has(Tags.SELECTED)}
            get={[[TitleFacet, IdentifierFacet, TextFacet], []]}
            onMatch={HomeworkView}
          />
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataType.SUBTOPIC) && e.has(Tags.SELECTED)}
            get={[[TitleFacet, TextFacet, IdentifierFacet], []]}
            onMatch={SubtopicView}
          />
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataType.FLASHCARD) && e.has(Tags.SELECTED)}
            get={[[AnswerFacet, QuestionFacet, MasteryLevelFacet, IdentifierFacet], []]}
            onMatch={EditFlashcardSetSheet}
          />
        </Fragment>
      )}

      <DeletePodcastAlert />
    </Fragment>
  );
};

export default BookmarkCollectionView;
