import {
  NavigationBar,
  Spacer,
  TextEditor,
  Title,
  View,
} from "../../../components";
import { EntityProps } from "@leanscope/ecs-engine";
import { DueDateProps, TitleProps } from "../../../app/AdditionalFacets";
import {
  IdentifierProps,
  ParentProps,
  TextProps,
} from "@leanscope/ecs-models";
import { useIsViewVisible } from "../../../hooks/useIsViewVisible";
import { AdditionalTags } from "../../../base/enums";
import BackButton from "../../../components/buttons/BackButton";
import { useSelectedLanguage } from "../../../hooks/useSelectedLanguage";
import { displayHeaderTexts } from "../../../utils/selectDisplayText";
import supabase from "../../../lib/supabase";

const HomeworkView = (
  props: EntityProps &
    TitleProps &
    TextProps &
    DueDateProps &
    ParentProps &
    IdentifierProps
) => {
  const { title, text, dueDate, parentId, guid, entity } = props;
  const isVisible = useIsViewVisible(entity);
  const { selectedLanguage } = useSelectedLanguage();

  const navigateBack = () => entity.addTag(AdditionalTags.NAVIGATE_BACK);

  const handleTextChange = async (value: string) => {
    console.log("updating homework text", value);
    const { error } = await supabase
      .from("homeworks")
      .update({ text: value })
      .eq("id", guid);


      if (error) {
        console.error("Error updating homework text", error);
      }
  };

  return (
  
      <View visibe={isVisible}>
        <NavigationBar></NavigationBar>
        <BackButton
          backButtonLabel={
            displayHeaderTexts(selectedLanguage).homeworksHeaderText
          }
          navigateBack={navigateBack}
        />
        <Title>{title}</Title>
        <Spacer size={8} />
        <TextEditor onBlur={handleTextChange} value={text} />
      </View>
  );
};

export default HomeworkView;
