import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { EntityPropsMapper } from '@leanscope/ecs-engine';
import { IdentifierFacet, Tags, TextFacet } from '@leanscope/ecs-models';
import { Fragment, useContext } from 'react';
import { IoAdd } from 'react-icons/io5';
import { TitleFacet } from '../base/additionalFacets';
import { DataType, Story } from '../base/enums';
import { useSelectedLanguage } from '../common/hooks/useSelectedLanguage';
import { displayHeaderTexts } from '../common/utilities/displayText';
import { dataTypeQuery } from '../common/utilities/queries';
import { sortEntitiesByDateAdded, sortEntitiesByDueDate } from '../common/utilities/sortEntitiesByTime';
import { Kanban, NavBarButton, NavigationBar, Spacer, Title, View } from '../components';
import AddExamSheet from '../features/exams/components/AddExamSheet';
import ExamKanbanCell from '../features/exams/components/ExamKanbanCell';
import ExamView from '../features/exams/components/ExamView';
import { useExamStatus } from '../features/exams/hooks/useExamStatus';
import InitializeExamsSystem from '../features/exams/systems/InitializeExamsSystem';

const Exams = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { selectedLanguage } = useSelectedLanguage();
  const { updateExamStatus } = useExamStatus();

  const openAddExamSheet = () => lsc.stories.transitTo(Story.ADDING_EXAM_STORY);

  return (
    <Fragment>
      <InitializeExamsSystem />

      <View reducePaddingX viewType="baseView">
        <NavigationBar>
          <NavBarButton onClick={openAddExamSheet}>
            <IoAdd />
          </NavBarButton>
        </NavigationBar>
        <Spacer size={8} />
        <Title>{displayHeaderTexts(selectedLanguage).exams}</Title>
        <Spacer />

        <Kanban
          updateEntityStatus={updateExamStatus}
          sortingRule={sortEntitiesByDueDate}
          kanbanCell={ExamKanbanCell as () => JSX.Element}
          query={(e) => dataTypeQuery(e, DataType.EXAM)}
        />
      </View>

      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataType.EXAM) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, IdentifierFacet, TextFacet], []]}
        sort={sortEntitiesByDateAdded}
        onMatch={ExamView}
      />
      <AddExamSheet />
    </Fragment>
  );
};

export default Exams;
