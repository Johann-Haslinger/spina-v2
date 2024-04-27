import React, { useContext } from "react";
import {
  Kanban,
  NavBarButton,
  NavigationBar,
  Spacer,
  Title,
  View,
} from "../components";
import { IoAdd } from "react-icons/io5";
import { displayHeaderTexts } from "../utils/selectDisplayText";
import { useSelectedLanguage } from "../hooks/useSelectedLanguage";
import HomeworksInitSystem from "../features/homeworks/systems/HomeworksInitSystem";
import { dataTypeQuery } from "../utils/queries";
import { DataTypes, Stories } from "../base/enums";
import {
  AddHomeworkSheet,
  HomeworkKanbanCell,
} from "../features/homeworks";
import { Entity, EntityPropsMapper } from "@leanscope/ecs-engine";
import {
  IdentifierFacet,
  ParentFacet,
  Tags,
  TextFacet,
} from "@leanscope/ecs-models";
import { DueDateFacet, TitleFacet } from "../app/AdditionalFacets";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { sortEntitiesByDueDate } from "../utils/sortEntitiesByTime";
import supabaseClient from "../lib/supabase";
import { HomeworkView } from "../features/collection";

const Homeworks = (props: { mockup?: boolean }) => {
  const lsc = useContext(LeanScopeClientContext);
  const { mockup } = props;
  const { selectedLanguage } = useSelectedLanguage();

  const openAddHomeworkSheet = () =>
    lsc.stories.transitTo(Stories.ADD_HOMEWORK_STORY);

  const updateHomeworkStatus = async (homework: Entity, status: number) => {
    const homeworkId = homework.get(IdentifierFacet)?.props.guid;
    const { error } = await supabaseClient
      .from("homeworks")
      .update({ status })
      .eq("id", homeworkId);
    if (error) {
      console.error("Error updating homework status", error);
    }
  };

  return (
    <>
      <HomeworksInitSystem  />

      <View reducePaddingX viewType="baseView">
        <NavigationBar>
          <NavBarButton onClick={openAddHomeworkSheet}>
            <IoAdd />
          </NavBarButton>
        </NavigationBar>
        <Title size="large">
          {displayHeaderTexts(selectedLanguage).homeworksHeaderText}
        </Title>
        <Spacer />
        <Kanban
          updateEntityStatus={updateHomeworkStatus}
          sortingRule={sortEntitiesByDueDate}
          kanbanCell={HomeworkKanbanCell}
          query={(e) => dataTypeQuery(e, DataTypes.HOMEWORK)}
        />
      </View>

      <EntityPropsMapper
        query={(e) =>
          dataTypeQuery(e, DataTypes.HOMEWORK) && e.has(Tags.SELECTED)
        }
        get={[
          [TitleFacet, DueDateFacet, ParentFacet, TextFacet, IdentifierFacet],
          [],
        ]}
        onMatch={HomeworkView}
      />
      <AddHomeworkSheet />
    </>
  );
};

export default Homeworks;
