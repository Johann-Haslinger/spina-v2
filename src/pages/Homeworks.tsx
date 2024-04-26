import React, { useContext, useEffect } from "react";
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
import { DataTypes, StoryGuid } from "../base/enums";
import {
  AddHomeworkSheet,
  HomeworkKanbanCell,
  HomeworkView,
} from "../features/homeworks";
import { Entity, EntityPropsMapper, useEntities } from "@leanscope/ecs-engine";
import {
  IdentifierFacet,
  ParentFacet,
  Tags,
  TextFacet,
} from "@leanscope/ecs-models";
import { DueDateFacet, TitleFacet } from "../app/AdditionalFacets";
import LoadHomeworkTextSystem from "../features/homeworks/systems/LoadHomeworkTextSystem";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { sortEntitiesByDueDate } from "../utils/sortEntitiesByTime";
import supabase from "../lib/supabase";

const Homeworks = (props: { mockup?: boolean }) => {
  const lsc = useContext(LeanScopeClientContext);
  const { mockup } = props;
  const { selectedLanguage } = useSelectedLanguage();

  const openAddHomeworkSheet = () =>
    lsc.stories.transitTo(StoryGuid.ADD_HOMEWORK_STORY);

  const updateHomeworkStatus = async (homework: Entity, status: number) => {
    const homeworkId = homework.get(IdentifierFacet)?.props.guid;
    const { error } = await supabase
      .from("homeworks")
      .update({ status })
      .eq("id", homeworkId);
    if (error) {
      console.error("Error updating homework status", error);
    }
  };

  return (
    <>
      <HomeworksInitSystem mockupData={mockup} />
      <LoadHomeworkTextSystem mockupData={mockup} />

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
