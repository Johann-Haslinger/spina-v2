import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { EntityProps } from "@leanscope/ecs-engine";
import { IdentifierProps, TextFacet, TextProps } from "@leanscope/ecs-models";
import { useContext } from "react";
import { IoCreateOutline, IoEllipsisHorizontalCircleOutline, IoTrashOutline } from "react-icons/io5";
import { Fragment } from "react/jsx-runtime";
import { TitleProps } from "../../../app/additionalFacets";
import { AdditionalTags, Stories, SupabaseColumns, SupabaseTables } from "../../../base/enums";
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
import { useIsViewVisible } from "../../../hooks/useIsViewVisible";
import { useSelectedLanguage } from "../../../hooks/useSelectedLanguage";
import supabaseClient from "../../../lib/supabase";
import { displayActionTexts, displayButtonTexts, displayHeaderTexts } from "../../../utils/displayText";
import LoadExamTextSystem from "../systems/LoadExamTextSystem";
import DeleteExamAlert from "./DeleteExamAlert";
import EditExamSheet from "./EditExamSheet";

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
    const { error } = await supabaseClient
      .from(SupabaseTables.EXAMS)
      .update({ text: value })
      .eq(SupabaseColumns.ID, guid);

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
