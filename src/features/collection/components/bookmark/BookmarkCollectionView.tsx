import { useIsStoryCurrent } from "@leanscope/storyboarding";
import { Fragment, useContext } from "react";
import { AdditionalTags, DataTypes, Stories } from "../../../../base/enums";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import {
  BackButton,
  CollectionGrid,
  NavigationBar,
  NoContentAddedHint,
  Spacer,
  Title,
  View,
} from "../../../../components";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayHeaderTexts } from "../../../../utils/displayText";
import { EntityPropsMapper, useEntities } from "@leanscope/ecs-engine";
import InitializeBookmarkedResourcesSystem from "../../systems/InitializeBookmarkedResourcesSystem";
import { TextFacet, IdentifierFacet, Tags } from "@leanscope/ecs-models";
import {
  AnswerFacet,
  DateAddedFacet,
  MasteryLevelFacet,
  QuestionFacet,
  TitleFacet,
} from "../../../../app/AdditionalFacets";
import { dataTypeQuery } from "../../../../utils/queries";
import { sortEntitiesByDateAdded } from "../../../../utils/sortEntitiesByTime";
import FlashcardSetCell from "../flashcard-sets/FlashcardSetCell";
import FlashcardSetView from "../flashcard-sets/FlashcardSetView";
import HomeworkCell from "../homeworks/HomeworkCell";
import HomeworkView from "../homeworks/HomeworkView";
import NoteCell from "../notes/NoteCell";
import NoteView from "../notes/NoteView";
import SubtopicCell from "../subtopics/SubtopicCell";
import SubtopicView from "../subtopics/SubtopicView";
import FlashcardCell from "../flashcard-sets/FlashcardCell";
import EditFlashcardSetSheet from "../flashcard-sets/EditFlashcardSetSheet";
import PodcastRow from "../podcasts/PodcastRow";
import DeletePodcastAlert from "../podcasts/DeletePodcastAlert";

const BookmarkCollectionView = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Stories.OBSERVING_BOOKMARK_COLLECTION_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const [bookmarkedEntities] = useEntities((e) => e.has(AdditionalTags.BOOKMARKED));
  const [bookmarkedPodcasts] = useEntities((e) => e.has(AdditionalTags.BOOKMARKED) && dataTypeQuery(e, DataTypes.PODCAST));
  const [bookmarkedFlashcards] = useEntities((e) => e.has(AdditionalTags.BOOKMARKED) && dataTypeQuery(e, DataTypes.FLASHCARD));

  const navigateBack = () => lsc.stories.transitTo(Stories.OBSERVING_COLLECTION_STORY);

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
            query={(e) => dataTypeQuery(e, DataTypes.SUBTOPIC) && e.has(AdditionalTags.BOOKMARKED)}
            sort={(a, b) => sortEntitiesByDateAdded(a, b)}
            get={[[TitleFacet], []]}
            onMatch={SubtopicCell}
          />
        </CollectionGrid>

        <CollectionGrid>
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataTypes.NOTE) && e.has(AdditionalTags.BOOKMARKED)}
            sort={(a, b) => sortEntitiesByDateAdded(a, b)}
            get={[[TitleFacet], []]}
            onMatch={NoteCell}
          />
        </CollectionGrid>

        <CollectionGrid>
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataTypes.FLASHCARD_SET) && e.has(AdditionalTags.BOOKMARKED)}
            get={[[TitleFacet, IdentifierFacet], []]}
            sort={(a, b) => sortEntitiesByDateAdded(a, b)}
            onMatch={FlashcardSetCell}
          />
        </CollectionGrid>

        <CollectionGrid>
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataTypes.HOMEWORK) && e.has(AdditionalTags.BOOKMARKED)}
            get={[[TitleFacet, TextFacet, IdentifierFacet], []]}
            sort={(a, b) => sortEntitiesByDateAdded(a, b)}
            onMatch={HomeworkCell}
          />
        </CollectionGrid>

        <Spacer size={8} />
        {bookmarkedFlashcards.length > 0 && <Title size="small">{displayHeaderTexts(selectedLanguage).flashcards}</Title>}
        <Spacer />
        <CollectionGrid columnSize="large">
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataTypes.FLASHCARD) && e.has(AdditionalTags.BOOKMARKED)}
            get={[[AnswerFacet, QuestionFacet, MasteryLevelFacet, IdentifierFacet], []]}
            onMatch={FlashcardCell}
          />
        </CollectionGrid>
        <Spacer size={8} />  
        {bookmarkedPodcasts.length > 0 && <Title size="small" >{displayHeaderTexts(selectedLanguage).podcasts}</Title>} 
        <EntityPropsMapper
          query={(e) => dataTypeQuery(e, DataTypes.PODCAST) && e.has(AdditionalTags.BOOKMARKED)}
          get={[[TitleFacet, DateAddedFacet], []]}
          onMatch={PodcastRow}
        />
      </View>

      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataTypes.NOTE) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, TextFacet, IdentifierFacet], []]}
        onMatch={NoteView}
      />
      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataTypes.FLASHCARD_SET) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, IdentifierFacet], []]}
        onMatch={FlashcardSetView}
      />
      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataTypes.HOMEWORK) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, IdentifierFacet, TextFacet], []]}
        onMatch={HomeworkView}
      />
      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataTypes.SUBTOPIC) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, TextFacet, IdentifierFacet], []]}
        onMatch={SubtopicView}
      />
      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataTypes.FLASHCARD) && e.has(Tags.SELECTED)}
        get={[[AnswerFacet, QuestionFacet, MasteryLevelFacet, IdentifierFacet], []]}
        onMatch={EditFlashcardSetSheet}
      />

      <DeletePodcastAlert />
    </Fragment>
  );
};

export default BookmarkCollectionView;
