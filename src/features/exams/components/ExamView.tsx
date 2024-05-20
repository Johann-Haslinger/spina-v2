import { IdentifierProps, TextFacet, TextProps } from "@leanscope/ecs-models";
import { TitleProps } from "../../../app/additionalFacets";
import { EntityProps } from "@leanscope/ecs-engine";
import { Fragment } from "react/jsx-runtime";
import {
  ActionRow,
  BackButton,
  NavBarButton,
  NavigationBar,
  Spacer,
  TextEditor,
  Title,
  View,
} from "../../../components";
import { IoCreateOutline, IoEllipsisHorizontalCircleOutline, IoTrashOutline } from "react-icons/io5";
import { useIsViewVisible } from "../../../hooks/useIsViewVisible";
import { displayActionTexts, displayButtonTexts, displayHeaderTexts } from "../../../utils/displayText";
import { useSelectedLanguage } from "../../../hooks/useSelectedLanguage";
import { AdditionalTags, Stories } from "../../../base/enums";
import supabaseClient from "../../../lib/supabase";
import LoadExamTextSystem from "../systems/LoadExamTextSystem";
import EditExamSheet from "./EditExamSheet";
import DeleteExamAlert from "./DeleteExamAlert";
import { useContext } from "react";
import { LeanScopeClientContext } from "@leanscope/api-client/node";

const ExamView = (props: TitleProps & TextProps & IdentifierProps & EntityProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, text, guid, entity } = props;
  const isVisible = useIsViewVisible(entity);
  const { selectedLanguage } = useSelectedLanguage();

  const navigateBack = () => entity.add(AdditionalTags.NAVIGATE_BACK);
  const openEditExamSheet = () => lsc.stories.transitTo(Stories.EDITING_EXAM_STORY);
  const openDeleteExamAlert = () => lsc.stories.transitTo(Stories.DELETING_EXAM_STORY);

  const handleTextBlur = async (value: string) => {
    entity.add(new TextFacet({ text: value }));
    const { error } = await supabaseClient.from("exams").update({ text: value }).eq("id", guid);

    if (error) {
      console.error("Error updating exam text", error);
    }
  };

  return (
    <Fragment>
      <LoadExamTextSystem />

      <View visible={isVisible}>
        <NavigationBar>
          <NavBarButton
            content={
              <Fragment>
                <ActionRow onClick={openEditExamSheet} icon={<IoCreateOutline />} first>
                  {displayActionTexts(selectedLanguage).edit}
                </ActionRow>
                <ActionRow onClick={openDeleteExamAlert} icon={<IoTrashOutline />} last destructive>
                  {displayActionTexts(selectedLanguage).delete}
                </ActionRow>
              </Fragment>
            }
          >
            <IoEllipsisHorizontalCircleOutline />
          </NavBarButton>
        </NavigationBar>
        <BackButton navigateBack={navigateBack}>
          {displayHeaderTexts(selectedLanguage).exams || displayButtonTexts(selectedLanguage).back}
        </BackButton>
        <Title>{title}</Title>
        <Spacer />
        <TextEditor value={text} onBlur={handleTextBlur} />
      </View>

      <EditExamSheet />
      <DeleteExamAlert />
    </Fragment>
  );
};

export default ExamView;
