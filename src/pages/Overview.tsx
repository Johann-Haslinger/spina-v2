import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { EntityPropsMapper } from '@leanscope/ecs-engine';
import { IdentifierFacet, Tags, TextFacet } from '@leanscope/ecs-models';
import { useContext } from 'react';
import { IoAdd } from 'react-icons/io5';
import tw from 'twin.macro';
import { TitleFacet } from '../app/additionalFacets';
import { DataType, Story } from '../base/enums';
import { ActionRow, NavBarButton, NavigationBar, Spacer, Title, View } from '../components';
import { AddHomeworkSheet, HomeworkView } from '../features/collection';
import AddExamSheet from '../features/exams/components/AddExamSheet';
import ExamView from '../features/exams/components/ExamView';
import StreakCard from '../features/flashcards/components/StreakCard';
import LoadCurrentStreakSystem from '../features/flashcards/systems/LoadCurrentStrekSystem';
import LoadFlashcardSessionsSystem from '../features/flashcards/systems/LoadFlashcardSessionsSystem';
import {
  ExploreCard,
  LastWeekInfoCard,
  NewResourcesCard,
  PendingResourcesCard,
  StartFlashcardSessionCard,
} from '../features/overview';
import FlashcarChartCard from '../features/overview/components/FlashcarChartCard';
import { useSelectedLanguage } from '../hooks/useSelectedLanguage';
import { displayDataTypeTexts, displayHeaderTexts } from '../utils/displayText';
import { dataTypeQuery } from '../utils/queries';

const StyledColumnsWrapper = styled.div`
  ${tw`grid grid-cols-1 md:grid-cols-2 gap-4`}
`;

const StyledColumn = styled.div`
  ${tw`flex space-y-4 w-full flex-col`}
`;

const Overview = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { selectedLanguage } = useSelectedLanguage();

  const openAddHomeworkSheet = () => lsc.stories.transitTo(Story.ADDING_HOMEWORK_STORY);
  const openAddExamSheet = () => lsc.stories.transitTo(Story.ADDING_EXAM_STORY);

  return (
    <div>
      <LoadFlashcardSessionsSystem />
      <LoadCurrentStreakSystem />

      <View viewType="baseView">
        <NavigationBar>
          <NavBarButton
            content={
              <div>
                <ActionRow first onClick={openAddHomeworkSheet} icon={<IoAdd />}>
                  {displayDataTypeTexts(selectedLanguage).homework}
                </ActionRow>
                <ActionRow last onClick={openAddExamSheet} icon={<IoAdd />}>
                  {displayDataTypeTexts(selectedLanguage).exam}
                </ActionRow>
              </div>
            }
          >
            <IoAdd />
          </NavBarButton>
        </NavigationBar>
        <Spacer size={8} />
        <Title>{displayHeaderTexts(selectedLanguage).overview}</Title>
        <Spacer size={4} />
        <StyledColumnsWrapper>
          <StyledColumn>
            <PendingResourcesCard />
            <ExploreCard />
            <LastWeekInfoCard height="24rem" />
          </StyledColumn>
          <StyledColumn>
            <StartFlashcardSessionCard />
            <FlashcarChartCard />
            <NewResourcesCard />
            <StreakCard />
          </StyledColumn>
        </StyledColumnsWrapper>
      </View>

      <AddHomeworkSheet />
      <AddExamSheet />

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
    </div>
  );
};

export default Overview;
