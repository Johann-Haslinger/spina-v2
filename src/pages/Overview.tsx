import styled from '@emotion/styled';
import { EntityPropsMapper } from '@leanscope/ecs-engine';
import { IdentifierFacet, Tags, TextFacet } from '@leanscope/ecs-models';
import { Fragment } from 'react/jsx-runtime';
import tw from 'twin.macro';
import { TitleFacet } from '../app/additionalFacets';
import { DataType } from '../base/enums';
import { NavigationBar, Spacer, Title, View } from '../components';
import { HomeworkView } from '../features/collection';
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
import { displayHeaderTexts } from '../utils/displayText';
import { dataTypeQuery } from '../utils/queries';

const StyledColumnsWrapper = styled.div`
  ${tw`grid grid-cols-1 md:grid-cols-2 gap-4`}
`;

const StyledColumn = styled.div`
  ${tw`flex space-y-4 w-full flex-col`}
`;
const Overview = () => {
  const { selectedLanguage } = useSelectedLanguage();

  return (
    <Fragment>
      <LoadFlashcardSessionsSystem />
      <LoadCurrentStreakSystem />

      <View viewType="baseView">
        <NavigationBar></NavigationBar>
        <Spacer size={8} />
        <Title>{displayHeaderTexts(selectedLanguage).overview}</Title>
        <Spacer size={4} />
        <StyledColumnsWrapper>
          <StyledColumn>
            <PendingResourcesCard />
            <ExploreCard />
            <LastWeekInfoCard />
          </StyledColumn>
          <StyledColumn>
            <StartFlashcardSessionCard />
            <FlashcarChartCard />

            <NewResourcesCard />
            <StreakCard />
          </StyledColumn>
        </StyledColumnsWrapper>
      </View>

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
    </Fragment>
  );
};

export default Overview;

{
  /* <StyledSubtitle>{displayLabelTexts(selectedLanguage).pendingResources}</StyledSubtitle>

        <Spacer size={2} />
        <EntityPropsMapper
          query={(e) =>
            (e.has(DataTypes.HOMEWORK) || e.has(DataTypes.EXAM)) &&
            new Date(e.get(DueDateFacet)?.props.dueDate || '') <= twoWeeksFromNow &&
            [1, 2, 3].includes(e.get(StatusFacet)?.props.status || 0)
          }
          get={[[DueDateFacet, TitleFacet, StatusFacet], []]}
          sort={(a, b) => sortEntitiesByDueDate(a, b)}
          onMatch={PendingResourceRow}
        />
        {pendingResourceEntities.length == 0 && (
          <SectionRow icon={<IoCheckmarkCircleOutline />} last>
            Alles erledigt
          </SectionRow>
        )}

        <Spacer size={14} />
        <StyledSubtitle>{displayLabelTexts(selectedLanguage).recentlyAdded}</StyledSubtitle>
        <Spacer />
        <EntityPropsMapper
          query={(e) => e.has(AdditionalTags.RECENTLY_ADDED)}
          get={[[TitleFacet], []]}
          sort={(a, b) => sortEntitiesByDueDate(a, b)}
          onMatch={RecentlyAddedResourceRow}
        />
        {recentlyAddedResourceEntities.length == 0 && (
          <SectionRow icon={<IoCheckmarkCircleOutline />} last>
            Nichts hinzugefügt
          </SectionRow>
        )}

        <Spacer size={14} />
        <StyledSubtitle>{displayLabelTexts(selectedLanguage).kanban}</StyledSubtitle>
        <Spacer />

        <Kanban
          updateEntityStatus={updatePendingResourceStatus}
          sortingRule={sortEntitiesByDueDate}
          query={(e) => dataTypeQuery(e, DataTypes.HOMEWORK) || dataTypeQuery(e, DataTypes.EXAM)}
          kanbanCell={PendingResourceKanbanCell as () => JSX.Element}
        />

        <Spacer size={20} /> */
}
