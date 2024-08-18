import styled from '@emotion/styled';
import { EntityPropsMapper, useEntities } from '@leanscope/ecs-engine';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import { Fragment } from 'react/jsx-runtime';
import tw from 'twin.macro';
import { DueDateFacet, StatusFacet, TitleFacet } from '../app/additionalFacets';
import { AdditionalTags, DataTypes } from '../base/enums';
import { Kanban, NavigationBar, SectionRow, Spacer, Title, View } from '../components';
import InitializeExamsSystem from '../features/exams/systems/InitializeExamsSystem';
import InitializeHomeworksSystem from '../features/homeworks/systems/InitializeHomeworksSystem';
import {
  InitializeRecentlyAddedResources,
  PendingResourceKanbanCell,
  PendingResourceRow,
  RecentlyAddedResourceRow,
  usePendingResourceStatus,
} from '../features/overview';
import { useSelectedLanguage } from '../hooks/useSelectedLanguage';
import { displayHeaderTexts, displayLabelTexts } from '../utils/displayText';
import { dataTypeQuery } from '../utils/queries';
import { sortEntitiesByDueDate } from '../utils/sortEntitiesByTime';

const useTwoWeeksFromNow = () => {
  const currentDate = new Date();
  const twoWeeksFromNow = new Date();
  twoWeeksFromNow.setDate(currentDate.getDate() + 14);

  return twoWeeksFromNow;
};

const StyledSubtitle = styled.p`
  ${tw`md:text-xl text-lg font-bold`}
`;

const Overview = () => {
  const { selectedLanguage } = useSelectedLanguage();
  const { updatePendingResourceStatus } = usePendingResourceStatus();
  const twoWeeksFromNow = useTwoWeeksFromNow();
  const [pendingResourceEntities] = useEntities(
    (e) =>
      (e.has(DataTypes.HOMEWORK) || e.has(DataTypes.EXAM)) &&
      new Date(e.get(DueDateFacet)?.props.dueDate || '') <= twoWeeksFromNow &&
      [1, 2, 3].includes(e.get(StatusFacet)?.props.status || 0),
  );
  const [recentlyAddedResourceEntities] = useEntities((e) => e.has(AdditionalTags.RECENTLY_ADDED));

  return (
    <Fragment>
      <InitializeExamsSystem />
      <InitializeHomeworksSystem />
      <InitializeRecentlyAddedResources />

      <View viewType="baseView">
        <NavigationBar></NavigationBar>
        <Spacer size={8} />
        <Title size="large">{displayHeaderTexts(selectedLanguage).overview}</Title>

        <Spacer size={8} />
        <StyledSubtitle>{displayLabelTexts(selectedLanguage).pendingResources}</StyledSubtitle>

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

        <Spacer size={20} />
      </View>
    </Fragment>
  );
};

export default Overview;
