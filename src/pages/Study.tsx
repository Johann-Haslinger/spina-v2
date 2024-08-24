import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { EntityPropsMapper } from '@leanscope/ecs-engine';
import { IdentifierFacet, Tags, TextFacet } from '@leanscope/ecs-models';
import { Fragment, useContext } from 'react';
import { IoAdd } from 'react-icons/io5';
import { DateAddedFacet, TitleFacet } from '../app/additionalFacets';
import { DataType, Story } from '../base/enums';
import { CollectionGrid, NavBarButton, NavigationBar, NoContentAddedHint, Spacer, Title, View } from '../components';
import { FlashcardSetView } from '../features/collection';
import AddFlashcardSetSheet from '../features/collection/components/flashcard-sets/AddFlashcardSetSheet';
import SubtopicView from '../features/collection/components/subtopics/SubtopicView';
import LoadSubtopicResourcesSystem from '../features/collection/systems/LoadSubtopicResourcesSystem';
import { FlashcardGroupCell, InitializeFlashcardGroupsSystem, LoadFlashcardsSystem } from '../features/study';
import FlashcardQuizView from '../features/study/components/FlashcardQuizView';
import LernplanSection from '../features/study/components/LernplanSection';
import { useFlashcardGroups } from '../features/study/hooks/useFlashcardGroups';
import { useSelectedLanguage } from '../hooks/useSelectedLanguage';
import { displayHeaderTexts } from '../utils/displayText';
import { dataTypeQuery } from '../utils/queries';
import { sortEntitiesByDateAdded } from '../utils/sortEntitiesByTime';

const Study = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { selectedLanguage } = useSelectedLanguage();
  const { existFlashcardGroups } = useFlashcardGroups();

  const openAddFlashcardGroupSheet = () => lsc.stories.transitTo(Story.ADDING_FLASHCARD_SET_STORY);

  return (
    <Fragment>
      <InitializeFlashcardGroupsSystem />
      <LoadFlashcardsSystem />
      <LoadSubtopicResourcesSystem />

      <View viewType="baseView">
        <NavigationBar>
          <NavBarButton onClick={openAddFlashcardGroupSheet}>
            <IoAdd />
          </NavBarButton>
        </NavigationBar>

        <Spacer size={8} />
        <Title>{displayHeaderTexts(selectedLanguage).study}</Title>
        <Spacer />
        {!existFlashcardGroups && <NoContentAddedHint />}
        <LernplanSection />

        <CollectionGrid>
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataType.FLASHCARD_GROUP)}
            get={[[TitleFacet, DateAddedFacet], []]}
            sort={sortEntitiesByDateAdded}
            onMatch={FlashcardGroupCell}
          />
        </CollectionGrid>
      </View>
      <EntityPropsMapper
        query={(e) => e.has(DataType.FLASHCARD_GROUP) && e.has(DataType.FLASHCARD_SET) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, IdentifierFacet], []]}
        onMatch={FlashcardSetView}
      />
      <EntityPropsMapper
        query={(e) => e.has(DataType.FLASHCARD_GROUP) && e.has(DataType.SUBTOPIC) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, IdentifierFacet, TextFacet], []]}
        onMatch={SubtopicView}
      />
      <AddFlashcardSetSheet />
      <FlashcardQuizView />
    </Fragment>
  );
};

export default Study;
