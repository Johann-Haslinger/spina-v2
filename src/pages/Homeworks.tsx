import { Fragment, useContext } from "react";
import { Kanban, NavBarButton, NavigationBar, Spacer, Title, View } from "../components";
import { IoAdd } from "react-icons/io5";
import { displayHeaderTexts } from "../utils/displayText";
import { useSelectedLanguage } from "../hooks/useSelectedLanguage";
import InitializeHomeworksSystem from "../features/homeworks/systems/InitializeHomeworksSystem";
import { dataTypeQuery } from "../utils/queries";
import { DataTypes, Stories } from "../base/enums";
import { HomeworkKanbanCell } from "../features/homeworks";
import { EntityPropsMapper } from "@leanscope/ecs-engine";
import { IdentifierFacet, ParentFacet, Tags, TextFacet } from "@leanscope/ecs-models";
import { DueDateFacet, TitleFacet } from "../app/AdditionalFacets";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { sortEntitiesByDueDate } from "../utils/sortEntitiesByTime";
import { AddHomeworkSheet, HomeworkView } from "../features/collection";
import { useHomeworkStatus } from "../features/homeworks/hooks/useHomeworkStatus";

const Homeworks = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { selectedLanguage } = useSelectedLanguage();
  const { updateHomeworkStatus } = useHomeworkStatus();

  const openAddHomeworkSheet = () => lsc.stories.transitTo(Stories.ADDING_HOMEWORK_STORY);

  return (
    <Fragment>
      <InitializeHomeworksSystem />

      <View reducePaddingX viewType="baseView">
        <NavigationBar>
          <NavBarButton onClick={openAddHomeworkSheet}>
            <IoAdd />
          </NavBarButton>
        </NavigationBar>
        <Title size="large">{displayHeaderTexts(selectedLanguage).homeworks}</Title>
        <Spacer />
        <Kanban
          updateEntityStatus={updateHomeworkStatus}
          sortingRule={sortEntitiesByDueDate}
          kanbanCell={HomeworkKanbanCell}
          query={(e) => dataTypeQuery(e, DataTypes.HOMEWORK)}
        />
      </View>

      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataTypes.HOMEWORK) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, DueDateFacet, ParentFacet, TextFacet, IdentifierFacet], []]}
        onMatch={HomeworkView}
      />
      <AddHomeworkSheet />
    </Fragment>
  );
};

export default Homeworks;
