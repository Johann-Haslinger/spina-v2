import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { EntityProps } from "@leanscope/ecs-engine";
import { IdentifierProps, TextProps } from "@leanscope/ecs-models";
import { Fragment, useContext } from "react";
import { IoCreateOutline, IoTrashOutline } from "react-icons/io5";
import { TitleProps } from "../../../../app/additionalFacets";
import { AdditionalTags, Stories } from "../../../../base/enums";
import { ActionRow, View } from "../../../../components";
import { useIsViewVisible } from "../../../../hooks/useIsViewVisible";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayActionTexts, displayHeaderTexts } from "../../../../utils/displayText";
import Blockeditor from "../../../blockeditor/components/Blockeditor";
import { useSelectedTopic } from "../../hooks/useSelectedTopic";
import LoadHomeworkTextSystem from "../../systems/LoadHomeworkTextSystem";
import DeleteHomeworkAlert from "./DeleteHomeworkAlert";
import EditHomeworkSheet from "./EditHomeworkSheet";

const HomeworkView = (props: EntityProps & TitleProps & TextProps & IdentifierProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, guid, entity } = props;
  const isVisible = useIsViewVisible(entity);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedTopicTitle } = useSelectedTopic();

  const navigateBack = () => entity.addTag(AdditionalTags.NAVIGATE_BACK);
  const openEditHomeworkSheet = () => lsc.stories.transitTo(Stories.EDITING_HOMEWORK_STORY);
  const openDeleteHomeworkAlert = () => lsc.stories.transitTo(Stories.DELETING_HOMEWORK_STORY);

  return (
    <Fragment>
      <LoadHomeworkTextSystem />

      <View visible={isVisible}>
        <Blockeditor
          title={title}
          id={guid}
          backbuttonLabel={selectedTopicTitle || displayHeaderTexts(selectedLanguage).homeworks}
          navigateBack={navigateBack}
          customActionRows={
            <Fragment>
              <ActionRow first onClick={openEditHomeworkSheet} icon={<IoCreateOutline />}>
                {displayActionTexts(selectedLanguage).edit}
              </ActionRow>
              <ActionRow onClick={openDeleteHomeworkAlert} icon={<IoTrashOutline />} destructive last>
                {displayActionTexts(selectedLanguage).delete}
              </ActionRow>
            </Fragment>
          }
        />
      </View>

      <DeleteHomeworkAlert />
      <EditHomeworkSheet />
    </Fragment>
  );
};

export default HomeworkView;
