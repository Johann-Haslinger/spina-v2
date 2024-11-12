import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { EntityPropsMapper } from '@leanscope/ecs-engine';
import { DescriptionFacet, IdentifierFacet, ImageFacet, Tags, TextFacet } from '@leanscope/ecs-models';
import { useContext } from 'react';
import { IoAdd, IoCameraOutline } from 'react-icons/io5';
import 'react-loading-skeleton/dist/skeleton.css';
import tw from 'twin.macro';
import FlashcardQuizView from '../common/components/flashcards/FlashcardQuizView';
import { useSelectedLanguage } from '../common/hooks/useSelectedLanguage';
import { LearningUnitTypeFacet, PriorityFacet, TitleFacet } from '../common/types/additionalFacets';
import { DataType, Story } from '../common/types/enums';
import { addUploadedFileEntity } from '../common/utilities/addUploadedFileEntity';
import { displayDataTypeTexts, displayHeaderTexts } from '../common/utilities/displayText';
import { dataTypeQuery } from '../common/utilities/queries';
import { ActionRow, NavBarButton, NavigationBar, Spacer, Title, View } from '../components';
import { AddHomeworkSheet, HomeworkView } from '../features/collection';
import GeneratingLearningUnitFromImageSheet from '../features/collection/components/generation/generate-learning-unit-from-image/GeneratingLearningUnitFromImageSheet';
import LearningUnitView from '../features/collection/components/learning_units/LearningUnitView';
import TopicView from '../features/collection/components/topics/TopicView';
import { useFileSelector } from '../features/collection/hooks/useFileSelector';
import AddExamSheet from '../features/exams/components/AddExamSheet';
import ExamView from '../features/exams/components/ExamView';
import StreakCard from '../features/flashcards/components/StreakCard';
import LoadCurrentStreakSystem from '../features/flashcards/systems/LoadCurrentStrekSystem';
import LoadFlashcardSessionsSystem from '../features/flashcards/systems/LoadFlashcardSessionsSystem';
import {
  AddGradeSheet,
  ExploreCard,
  GradesDetailsCard,
  LastFiftyDaysStatCard,
  LastWeekInfoCard,
  NewResourcesCard,
  PendingResourcesCard,
  RecentGradesCard,
  StartFlashcardSessionCard,
} from '../features/overview';
import FlashcardChartCard from '../features/overview/components/FlashcardChartCard';
import InitializeRecentlyAddedGrades from '../features/overview/systems/InitializeRecentlyAddedGrades';

const StyledColumnsWrapper = styled.div`
  ${tw`grid grid-cols-1 md:grid-cols-2 gap-4`}
`;

const StyledColumn = styled.div`
  ${tw`flex space-y-4 w-full flex-col`}
`;

const Overview = () => {
  const { selectedLanguage } = useSelectedLanguage();

  return (
    <div>
      <LoadFlashcardSessionsSystem />
      <InitializeRecentlyAddedGrades />
      <LoadCurrentStreakSystem />

      <View viewType="baseView">
        <NavigationBar>
          <AddResourcesButton />
        </NavigationBar>
        <Spacer size={8} />
        <Title>{displayHeaderTexts(selectedLanguage).overview}</Title>

        <Spacer />
        <StyledColumnsWrapper>
          <StyledColumn>
            <PendingResourcesCard />
            <ExploreCard />
            <GradesDetailsCard />
            <LastFiftyDaysStatCard />
            <StreakCard />
          </StyledColumn>
          <StyledColumn>
            <StartFlashcardSessionCard />
            <FlashcardChartCard />
            <NewResourcesCard />
            <LastWeekInfoCard />
            <RecentGradesCard />
          </StyledColumn>
        </StyledColumnsWrapper>
      </View>

      <AddHomeworkSheet />
      <AddExamSheet />
      <GeneratingLearningUnitFromImageSheet />
      <AddGradeSheet />

      <EntityPropsMapper
        query={(e) => e.has(Tags.SELECTED) && dataTypeQuery(e, DataType.HOMEWORK)}
        get={[[TitleFacet, TextFacet, IdentifierFacet], []]}
        onMatch={HomeworkView}
      />
      <EntityPropsMapper
        query={(e) => e.has(Tags.SELECTED) && dataTypeQuery(e, DataType.EXAM)}
        get={[[TitleFacet, TextFacet, IdentifierFacet], []]}
        onMatch={ExamView}
      />

      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataType.LEARNING_UNIT) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, IdentifierFacet, LearningUnitTypeFacet, PriorityFacet], []]}
        onMatch={LearningUnitView}
      />

      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataType.TOPIC) && e.hasTag(Tags.SELECTED)}
        get={[[TitleFacet, DescriptionFacet, ImageFacet], []]}
        onMatch={TopicView}
      />

      <FlashcardQuizView />
    </div>
  );
};

export default Overview;

const AddResourcesButton = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { selectedLanguage } = useSelectedLanguage();
  const { openFilePicker, fileInput } = useFileSelector(
    (file) => addUploadedFileEntity(lsc, file, openGenerateFromImageSheet),
    true,
  );

  const openAddHomeworkSheet = () => lsc.stories.transitTo(Story.ADDING_HOMEWORK_STORY);
  const openAddExamSheet = () => lsc.stories.transitTo(Story.ADDING_EXAM_STORY);
  const openGenerateFromImageSheet = () => lsc.stories.transitTo(Story.GENERATING_RESOURCES_FROM_IMAGE);
  const openAddGradeSheet = () => lsc.stories.transitTo(Story.AddING_GRADE_STORY);

  return (
    <div>
      <NavBarButton
        content={
          <div>
            <ActionRow first onClick={openAddHomeworkSheet} icon={<IoAdd />}>
              {displayDataTypeTexts(selectedLanguage).homework}
            </ActionRow>
            <ActionRow onClick={openAddExamSheet} icon={<IoAdd />}>
              {displayDataTypeTexts(selectedLanguage).exam}
            </ActionRow>
            <ActionRow hasSpace onClick={openAddGradeSheet} icon={<IoAdd />}>
              Note
            </ActionRow>
            <ActionRow last onClick={openFilePicker} icon={<IoCameraOutline />}>
              Aus Bild erzeugen
            </ActionRow>
          </div>
        }
      >
        <IoAdd />
      </NavBarButton>
      {fileInput}
    </div>
  );
};
