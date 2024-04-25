import React from "react";
import {
  BackButton,
  NavigationBar,
  Spacer,
  Title,
  View,
} from "../../../../components";
import { useSelectedTopic } from "../../hooks/useSelectedTopic";
import { TitleProps } from "../../../../app/AdditionalFacets";
import { EntityProps } from "@leanscope/ecs-engine";
import { TextProps } from "@leanscope/ecs-models";
import { AdditionalTags } from "../../../../base/enums";
import { useIsViewVisible } from "../../../../hooks/useIsViewVisible";

const NoteView = (props: TitleProps & EntityProps & TextProps) => {
  const { title, entity } = props;
  const { selectedTopicTitle } = useSelectedTopic();
  const isVisible = useIsViewVisible(entity);

  const navigateBack = () => entity.addTag(AdditionalTags.NAVIGATE_BACK);

  return (
    <View visibe={isVisible}>
      <NavigationBar></NavigationBar>
      <BackButton navigateBack={navigateBack}>{selectedTopicTitle}</BackButton>
      <Title>{title}</Title>
      <Spacer />
    </View>
  );
};

export default NoteView;
