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
import {  HomeworkKanbanCell } from "../features/homeworks";

const Homeworks = () => {
  const { selectedLanguage } = useSelectedLanguage();

  return (
    <>
      <HomeworksInitSystem mokUpData />

      <View reducePaddingX viewType="baseView">
        <NavigationBar>
          <IoAdd />
        </NavigationBar>
        <Title>
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
    </>
  );
};

export default Homeworks;
