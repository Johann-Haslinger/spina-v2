import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity, EntityPropsMapper, useEntities } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet, Tags } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useEffect } from 'react';
import { AnswerFacet, MasteryLevelFacet, QuestionFacet } from '../../../../app/additionalFacets';
import { dummyFlashcards } from '../../../../base/dummy';
import { AdditionalTag, DataType, Story, SupabaseTable } from '../../../../base/enums';
import {
  BackButton,
  CollectionGrid,
  NavigationBar,
  NoContentAddedHint,
  SecondaryText,
  Spacer,
  Title,
  View,
} from '../../../../components';
import { useCurrentDataSource } from '../../../../hooks/useCurrentDataSource';
import supabaseClient from '../../../../lib/supabase';
import { dataTypeQuery } from '../../../../utils/queries';
import { sortEntitiesByDateAdded } from '../../../../utils/sortEntitiesByTime';
import EditFlashcardSheet from '../flashcard-sets/EditFlashcardSheet';
import FlashcardCell from '../flashcard-sets/FlashcardCell';

const BookmarkedFlashcardsView = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.OBSERVING_BOOKMARKED_FLASHCARDS_STORY);
  const bookmarkedFlashcardsCount = useBookmarkedFlashcardsCount();

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_BOOKMARKS_STORY);

  return (
    <div>
      <InitializeBookmarkedFlashcardsSystem />

      <View visible={isVisible}>
        <NavigationBar />
        <BackButton navigateBack={navigateBack} />
        <Title>Lernkarten mit Lesezeichen</Title>
        <Spacer size={2} />
        <SecondaryText>Hier siehst du alle Lernkarten, die du mit einem Lesezeichen markiert hast.</SecondaryText>
        <Spacer size={6} />
        <CollectionGrid columnSize="large">
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataType.FLASHCARD) && e.has(AdditionalTag.BOOKMARKED)}
            get={[[QuestionFacet, AnswerFacet, MasteryLevelFacet], []]}
            sort={(a, b) => sortEntitiesByDateAdded(a, b)}
            onMatch={FlashcardCell}
          />
        </CollectionGrid>
        {bookmarkedFlashcardsCount === 0 && <NoContentAddedHint />}
      </View>

      <EntityPropsMapper
        query={(e) =>
          e.has(AdditionalTag.BOOKMARKED) && dataTypeQuery(e, DataType.FLASHCARD) && e.hasTag(Tags.SELECTED)
        }
        get={[[AnswerFacet, QuestionFacet, MasteryLevelFacet, IdentifierFacet], []]}
        onMatch={EditFlashcardSheet}
      />
    </div>
  );
};

export default BookmarkedFlashcardsView;

const fetchBookmarkedFlashcards = async () => {
  const { data: flashcards, error } = await supabaseClient
    .from(SupabaseTable.FLASHCARDS)
    .select('question, id, answer, mastery_level, parent_id')
    .eq('is_bookmarked', true);

  if (error) {
    console.error('Error fetching flashcards:', error);
    return [];
  }

  return flashcards || [];
};

const InitializeBookmarkedFlashcardsSystem = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { isUsingMockupData, isUsingSupabaseData } = useCurrentDataSource();
  const isVisible = useIsStoryCurrent(Story.OBSERVING_BOOKMARKED_FLASHCARDS_STORY);

  useEffect(() => {
    const initializeFlashcardEntities = async () => {
      const flashcards = isUsingMockupData
        ? dummyFlashcards
        : isUsingSupabaseData
          ? await fetchBookmarkedFlashcards()
          : [];

      flashcards.forEach((flashcard) => {
        const isExisting = lsc.engine.entities.some(
          (e) => e.get(IdentifierFacet)?.props.guid === flashcard.id && e.hasTag(DataType.FLASHCARD),
        );

        if (!isExisting) {
          const flashcardEntity = new Entity();
          lsc.engine.addEntity(flashcardEntity);
          flashcardEntity.add(new IdentifierFacet({ guid: flashcard.id }));
          flashcardEntity.add(new MasteryLevelFacet({ masteryLevel: flashcard.mastery_level }));
          flashcardEntity.add(new QuestionFacet({ question: flashcard.question }));
          flashcardEntity.add(new AnswerFacet({ answer: flashcard.answer }));
          flashcardEntity.add(new ParentFacet({ parentId: flashcard.parent_id }));
          flashcardEntity.addTag(DataType.FLASHCARD);
          flashcardEntity.addTag(AdditionalTag.BOOKMARKED);
        }
      });
    };

    if (isVisible) initializeFlashcardEntities();
  }, [isUsingMockupData, isUsingSupabaseData, isVisible]);

  return null;
};

const useBookmarkedFlashcardsCount = () => {
  const [bookmarkedFlashcardEntities] = useEntities(
    (e) => e.has(AdditionalTag.BOOKMARKED) && e.hasTag(DataType.FLASHCARD),
  );

  return bookmarkedFlashcardEntities.length;
};
