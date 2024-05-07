import { Fragment, useContext } from "react";
import { NavBarButton, NavigationBar, Spacer, Title, View } from "../components";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { Stories } from "../base/enums";
import { IoAdd } from "react-icons/io5";
import { useSelectedLanguage } from "../hooks/useSelectedLanguage";
import { displayHeaderTexts } from "../utils/displayText";
import InitializeExamsSystem from "../features/exams/systems/InitializeExamsSystem";
import AddExamSheet from "../features/exams/components/AddExamSheet";

const Exams = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { selectedLanguage } = useSelectedLanguage();

  const openAddExamSheet = () => lsc.stories.transitTo(Stories.ADD_EXAM_STORY);

  return (
    <Fragment>
      <InitializeExamsSystem />

      <View>
        <NavigationBar>
          <NavBarButton onClick={openAddExamSheet}>
            <IoAdd />
          </NavBarButton>
        </NavigationBar>
        <Title>{displayHeaderTexts(selectedLanguage).exams}</Title>
        <Spacer />
      </View>

      <AddExamSheet />
    </Fragment>
  );
};

export default Exams;
