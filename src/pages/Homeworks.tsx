import React, { useContext, useEffect } from "react";
import {
  CollectionLayout,
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
import { AddHomeworkSheet, HomeworkKanbanCell, HomeworkView } from "../features/homeworks";
import { EntityPropsMapper, useEntities } from "@leanscope/ecs-engine";
import {
  IdentifierFacet,
  ParentFacet,
  Tags,
  TextFacet,
} from "@leanscope/ecs-models";
import { DueDateFacet, TitleFacet } from "../app/AdditionalFacets";
import LoadHomeworkTextSystem from "../features/homeworks/systems/LoadHomeworkTextSystem";
import { LeanScopeClientContext } from "@leanscope/api-client/node";

const Homeworks = (props: { mockup?: boolean }) => {
  const lsc = useContext(LeanScopeClientContext);
  const { mockup } = props;
  const { selectedLanguage } = useSelectedLanguage();
  const [homeworkEntities] = useEntities((e) => dataTypeQuery(e, DataTypes.HOMEWORK));

  console.log(homeworkEntities);
  
  useEffect(() => {
    console.log(homeworkEntities);
  }, [homeworkEntities]);



  const openAddHomeworkSheet = () =>
    lsc.stories.transitTo(StoryGuid.ADD_NEW_HOMEWORK_STORY);

  return (
    <>
      <HomeworksInitSystem mokUpData={mockup} />
      <LoadHomeworkTextSystem mokUpData={mockup} />

      <View reducePaddingX viewType="baseView">
        <NavigationBar>
          <NavBarButton onClick={openAddHomeworkSheet} >
            <IoAdd  />
          </NavBarButton>
        </NavigationBar>
        <Title size="large">
          {displayHeaderTexts(selectedLanguage).homeworksHeaderText}
        </Title>
        <Spacer />
        <CollectionLayout>
          <Kanban
            kanbanCell={HomeworkKanbanCell}
            query={(e) => dataTypeQuery(e, DataTypes.HOMEWORK)}
          />
        </CollectionLayout>
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
