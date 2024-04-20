import React from "react";
import {
  CollectionLayout,
  Kanban,
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
import { DataTypes } from "../base/enums";
import { HomeworkKanbanCell, HomeworkView } from "../features/homeworks";
import { EntityPropsMapper } from "@leanscope/ecs-engine";
import {
  IdentifierFacet,
  ParentFacet,
  Tags,
  TextFacet,
} from "@leanscope/ecs-models";
import { DueDateFacet, TitleFacet } from "../app/AdditionalFacets";
import LoadHomeworkTextSystem from "../features/homeworks/systems/LoadHomeworkTextSystem";

const Homeworks = (props: {mockup?: boolean}) => {
  const { mockup } = props;
  const { selectedLanguage } = useSelectedLanguage();

  return (
    <>
      <HomeworksInitSystem mokUpData={mockup} />
      <LoadHomeworkTextSystem  mokUpData={mockup} />

      <View reducePaddingX viewType="baseView">
        <NavigationBar>
          <IoAdd />
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
    </>
  );
};

export default Homeworks;
