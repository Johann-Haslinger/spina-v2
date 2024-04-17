import React from "react";
import { TitleFacet, TitleProps } from "../../../../app/AdditionalFacets";
import { EntityProps, EntityPropsMapper } from "@leanscope/ecs-engine";
import { NavigationBar, Title, View } from "../../../../components";
import { AdditionalTags, DataTypes } from "../../../../base/enums";
import { LuPlus } from "react-icons/lu";
import { useIsViewVisible } from "../../../../hooks/useIsViewVisible";
import { useSchoolSubjectColors } from "../../../../hooks/useSchoolSubjectColors";
import { useSchoolSubjectTopicEntities } from "../../hooks/useSchoolSubjectTopicEntities";
import NoContentAdded from "../../../../components/content/NoContentAdded";
import SchoolSubjectTopicsInitSystem from "../../systems/SchoolSubjectTopicsInitSystem";
import { dataTypeQuery } from "../../../../utils/queries";
import { DescriptionFacet } from "@leanscope/ecs-models";
import TopicCell from "../topisc/TopicCell";

const SchoolSubjectView = (props: TitleProps & EntityProps) => {
  const { title, entity } = props;
  const isVisible = useIsViewVisible(entity);
  const { color, backgroundColor } = useSchoolSubjectColors(props.entity);
  const { hasTopics } = useSchoolSubjectTopicEntities(props.entity);

  const handleNavigateBack = () => entity.addTag(AdditionalTags.NAVIGATE_BACK);

  return (
    <View visibe={isVisible}>
      <SchoolSubjectTopicsInitSystem schoolSubjectEntity={props.entity} />
      <NavigationBar navigateBack={handleNavigateBack}>
        <LuPlus />
      </NavigationBar>
      {hasTopics && <Title>{title}</Title>}
      {!hasTopics && (
        <NoContentAdded backgroundColor={backgroundColor} color={color} />
      )}
      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataTypes.TOPIC)}
        get={[[TitleFacet], []]}
        onMatch={TopicCell}
      />
    </View>
  );
};

export default SchoolSubjectView;
