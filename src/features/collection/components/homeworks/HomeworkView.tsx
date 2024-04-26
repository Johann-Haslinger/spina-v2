import React from "react";
import {
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
import { AdditionalTags } from "../../../../base/enums";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayHeaderTexts } from "../../../../utils/selectDisplayText";
import supabase from "../../../../lib/supabase";
import { IoEllipsisHorizontalCircleOutline } from "react-icons/io5";
import LoadHomeworkTextSystem from "../../systems/LoadHomeworkTextSystem";

const HomeworkView = (
  props: EntityProps & TitleProps & TextProps & IdentifierProps
) => {
  const { title, text, guid, entity } = props;
  const isVisible = useIsViewVisible(entity);
  const { selectedLanguage } = useSelectedLanguage();

  const navigateBack = () => entity.addTag(AdditionalTags.NAVIGATE_BACK);

  const handleTextChange = async (value: string) => {
    const { error } = await supabase
      .from("homeworks")
      .update({ text: value })
      .eq("id", guid);

    if (error) {
      console.error("Error updating homework text", error);
    }
  };

  return (
    <>
      <LoadHomeworkTextSystem mockupData />

      <View visibe={isVisible}>
        <NavigationBar>
          <NavBarButton>
            <IoEllipsisHorizontalCircleOutline />
          </NavBarButton>
        </NavigationBar>
        <BackButton navigateBack={navigateBack}>
          {displayHeaderTexts(selectedLanguage).homeworksHeaderText}
        </BackButton>
        <Title>{title}</Title>
        <Spacer size={8} />
        <TextEditor onBlur={handleTextChange} value={text} />
      </View>
    </>
  );
};

export default HomeworkView;
