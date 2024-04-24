import React from "react";
import { NavigationBar, Title, View } from "../../../../components";
import { TitleProps } from "../../../../app/AdditionalFacets";
import { EntityProps, EntityPropsMapper } from "@leanscope/ecs-engine";
import { LuPlus } from "react-icons/lu";
import { useEntityHasTags } from "@leanscope/ecs-engine/react-api/hooks/useEntityComponents";
import { Tags } from "@leanscope/ecs-models";
import { useSelectedSchoolSubject } from "../../hooks/useSelectedSchoolSubject";
import { AdditionalTags } from "../../../../base/enums";
import { useIsViewVisible } from "../../../../hooks/useIsViewVisible";
import BackButton from "../../../../components/buttons/BackButton";

const TopicView = (props: TitleProps & EntityProps) => {
  const { title, entity } = props;
  const isVisible = useIsViewVisible(entity);
  const { selectedSchoolSubjectTitle } = useSelectedSchoolSubject();

  const navigateBack = () => entity.addTag(AdditionalTags.NAVIGATE_BACK);

  return (
    <View visibe={isVisible}>
      <NavigationBar>
        <LuPlus />
      </NavigationBar>
      <BackButton navigateBack={navigateBack}>
        {selectedSchoolSubjectTitle}
      </BackButton>
      <Title>{title}</Title>
    </View>
  );
};

export default TopicView;
