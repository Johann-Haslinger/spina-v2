import { Fragment, useContext } from "react";
import {
  ActionRow,
  BackButton,
  NavBarButton,
  NavigationBar,
  Spacer,
  TextEditor,
  Title,
  View,
} from "../../../../components";
import { EntityProps } from "@leanscope/ecs-engine";
import { TitleProps } from "../../../../app/AdditionalFacets";
import { IdentifierProps, TextProps } from "@leanscope/ecs-models";
import { useIsViewVisible } from "../../../../hooks/useIsViewVisible";
import { AdditionalTags, Stories } from "../../../../base/enums";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayActionTexts, displayHeaderTexts } from "../../../../utils/displayText";
import supabaseClient from "../../../../lib/supabase";
import { IoCreateOutline, IoEllipsisHorizontalCircleOutline, IoTrashOutline } from "react-icons/io5";
import LoadHomeworkTextSystem from "../../systems/LoadHomeworkTextSystem";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import DeleteHomeworkAlert from "./DeleteHomeworkAlert";
import EditHomeworkSheet from "./EditHomeworkSheet";

const HomeworkView = (props: EntityProps & TitleProps & TextProps & IdentifierProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, text, guid, entity } = props;
  const isVisible = useIsViewVisible(entity);
  const { selectedLanguage } = useSelectedLanguage();

  const navigateBack = () => entity.addTag(AdditionalTags.NAVIGATE_BACK);

  const handleTextChange = async (value: string) => {
    const { error } = await supabaseClient.from("homeworks").update({ text: value }).eq("id", guid);

    if (error) {
      console.error("Error updating homework text", error);
    }
  };

  const openEditHomeworkSheet = () => lsc.stories.transitTo(Stories.EDIT_HOMEWORK_STORY);
  const openDeleteHomeworkAlert = () => lsc.stories.transitTo(Stories.DELETE_HOMEWORK_STORY);

  return (
    <Fragment>
      <LoadHomeworkTextSystem />

      <View visibe={isVisible}>
        <NavigationBar>
          <NavBarButton
            content={
              <Fragment>
                <ActionRow first onClick={openEditHomeworkSheet} icon={<IoCreateOutline />}>
                  {displayActionTexts(selectedLanguage).edit}
                </ActionRow>
                <ActionRow onClick={openDeleteHomeworkAlert} icon={<IoTrashOutline />} destructive last>
                  {displayActionTexts(selectedLanguage).delete}
                </ActionRow>
              </Fragment>
            }
          >
            <IoEllipsisHorizontalCircleOutline />
          </NavBarButton>
        </NavigationBar>

        <BackButton navigateBack={navigateBack}>{displayHeaderTexts(selectedLanguage).homeworks}</BackButton>
        <Title>{title}</Title>
        <Spacer size={8} />
        <TextEditor onBlur={handleTextChange} value={text} />
      </View>

      <DeleteHomeworkAlert />
      <EditHomeworkSheet />
    </Fragment>
  );
};

export default HomeworkView;
