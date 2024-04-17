import React from "react";
import { TitleProps } from "../../../../app/AdditionalFacets";
import { EntityProps } from "@leanscope/ecs-engine";
import { NavigationBar, Title, View } from "../../../../components";
import { AdditionalTags } from "../../../../base/enums";
import useIsViewVisible from "../../../../hooks/useIsViewVisible";
import { LuArrowLeft, LuPlus } from "react-icons/lu";
import useSchoolSubjectColors from "../../../../hooks/useSchoolSubjectColors";

const SchoolSubjectView = (props: TitleProps & EntityProps) => {
  const { title, entity } = props;
  const isVisible = useIsViewVisible(entity);
  const { color, backgroundColor } = useSchoolSubjectColors(props.entity);

  const handleNavigateBack = () => entity.addTag(AdditionalTags.NAVIGATE_BACK);

  return (
    <View visibe={isVisible}>
      <NavigationBar navigateBack={handleNavigateBack}>
        <LuPlus />
      </NavigationBar>
      <Title>{title}</Title>
    </View>
  );
};

export default SchoolSubjectView;
