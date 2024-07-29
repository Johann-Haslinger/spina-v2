import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { EntityPropsMapper } from "@leanscope/ecs-engine";
import { IdentifierFacet, Tags, TextFacet } from "@leanscope/ecs-models";
import { Fragment, useContext } from "react";
import { IoAdd } from "react-icons/io5";
import { TitleFacet } from "../app/additionalFacets";
import { DataTypes, Stories } from "../base/enums";
import {
  Kanban,
  NavBarButton,
  NavigationBar,
  Spacer,
  Title,
  View,
} from "../components";
import AddExamSheet from "../features/exams/components/AddExamSheet";
import ExamKanbanCell from "../features/exams/components/ExamKanbanCell";
import ExamView from "../features/exams/components/ExamView";
import { useExamStatus } from "../features/exams/hooks/useExamStatus";
import InitializeExamsSystem from "../features/exams/systems/InitializeExamsSystem";
import { useSelectedLanguage } from "../hooks/useSelectedLanguage";
import { displayHeaderTexts } from "../utils/displayText";
import { dataTypeQuery } from "../utils/queries";
import {
  sortEntitiesByDateAdded,
  sortEntitiesByDueDate,
} from "../utils/sortEntitiesByTime";

const Exams = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { selectedLanguage } = useSelectedLanguage();
  const { updateExamStatus } = useExamStatus();

  const openAddExamSheet = () =>
    lsc.stories.transitTo(Stories.ADDING_EXAM_STORY);

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
