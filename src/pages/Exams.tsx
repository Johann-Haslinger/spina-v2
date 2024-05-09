import { Fragment, useContext } from "react";
import { Kanban, NavBarButton, NavigationBar, Spacer, Title, View } from "../components";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { DataTypes, Stories } from "../base/enums";
import { IoAdd } from "react-icons/io5";
import { useSelectedLanguage } from "../hooks/useSelectedLanguage";
import { displayHeaderTexts } from "../utils/displayText";
import InitializeExamsSystem from "../features/exams/systems/InitializeExamsSystem";
import AddExamSheet from "../features/exams/components/AddExamSheet";
import { sortEntitiesByDateAdded, sortEntitiesByDueDate } from "../utils/sortEntitiesByTime";
import ExamKanbanCell from "../features/exams/components/ExamKanbanCell";
import { dataTypeQuery } from "../utils/queries";
import { useExamStatus } from "../features/exams/hooks/useExamStatus";
import { EntityPropsMapper } from "@leanscope/ecs-engine";
import { IdentifierFacet, Tags, TextFacet } from "@leanscope/ecs-models";
import { TitleFacet } from "../app/AdditionalFacets";
import ExamView from "../features/exams/components/ExamView";

const Exams = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { selectedLanguage } = useSelectedLanguage();
  const { updateExamStatus } = useExamStatus();

  const openAddExamSheet = () => lsc.stories.transitTo(Stories.ADDING_EXAM_STORY);

  return (
    <Fragment>
      <InitializeExamsSystem />

      <View viewType="baseView">
        <NavigationBar>
          <NavBarButton onClick={openAddExamSheet}>
            <IoAdd />
          </NavBarButton>
        </NavigationBar>
        <Title>{displayHeaderTexts(selectedLanguage).exams}</Title>
        <Spacer />

        <Kanban
          updateEntityStatus={updateExamStatus}
          sortingRule={sortEntitiesByDueDate}
          kanbanCell={ExamKanbanCell}
          query={(e) => dataTypeQuery(e, DataTypes.EXAM)}
        />
      </View>

      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataTypes.EXAM) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, IdentifierFacet, TextFacet], []]}
        sort={sortEntitiesByDateAdded}
        onMatch={ExamView}
      />
      <AddExamSheet />
    </Fragment>
  );
};

export default Exams;
