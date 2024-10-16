import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { EntityPropsMapper } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet, Tags, TextFacet } from '@leanscope/ecs-models';
import { useContext } from 'react';
import { IoAdd, IoArchiveOutline } from 'react-icons/io5';
import { useSelectedLanguage } from '../common/hooks/useSelectedLanguage';
import { DueDateFacet, TitleFacet } from '../common/types/additionalFacets';
import { DataType, Story } from '../common/types/enums';
import { displayHeaderTexts } from '../common/utilities/displayText';
import { dataTypeQuery } from '../common/utilities/queries';
import { sortEntitiesByDueDate } from '../common/utilities/sortEntitiesByTime';
import { Kanban, NavBarButton, NavigationBar, Spacer, Title, View } from '../components';
import { AddHomeworkSheet, HomeworkView } from '../features/collection';
import { HomeworkKanbanCell } from '../features/homeworks';
import HomeworkArchive from '../features/homeworks/components/HomeworkArchive';
import { useHomeworkStatus } from '../features/homeworks/hooks/useHomeworkStatus';
import InitializeHomeworksSystem from '../features/homeworks/systems/InitializeHomeworksSystem';

const Homeworks = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { selectedLanguage } = useSelectedLanguage();
  const { updateHomeworkStatus } = useHomeworkStatus();

  const openAddHomeworkSheet = () => lsc.stories.transitTo(Story.ADDING_HOMEWORK_STORY);
  const openHomeworkArchive = () => lsc.stories.transitTo(Story.OBSERVING_HOMEWORKS_ARCHIVE_STORY);

  return (
    <div>
      <InitializeHomeworksSystem />

      <View reducePaddingX viewType="baseView">
        <NavigationBar>
          <NavBarButton onClick={openHomeworkArchive}>
            <IoArchiveOutline />
          </NavBarButton>
          <NavBarButton onClick={openAddHomeworkSheet}>
            <IoAdd />
          </NavBarButton>
        </NavigationBar>
        <Spacer size={8} />
        <Title>{displayHeaderTexts(selectedLanguage).homeworks}</Title>
        <Spacer />
        <Kanban
          updateEntityStatus={updateHomeworkStatus}
          sortingRule={sortEntitiesByDueDate}
          kanbanCell={HomeworkKanbanCell as () => JSX.Element}
          query={(e) => dataTypeQuery(e, DataType.HOMEWORK)}
        />
      </View>

      <HomeworkArchive />
      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataType.HOMEWORK) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, DueDateFacet, ParentFacet, TextFacet, IdentifierFacet], []]}
        onMatch={HomeworkView}
      />
      <AddHomeworkSheet />
    </div>
  );
};

export default Homeworks;
