import React from "react";
import { TitleFacet, TitleProps } from "../../../../app/AdditionalFacets";
import {
  EntityProps,
  EntityPropsMapper,
  useEntities,
} from "@leanscope/ecs-engine";
import {
  CollectionLayout,
  Divider,
  NavigationBar,
  Spacer,
  Title,
  View,
} from "../../../../components";
import { AdditionalTags, DataTypes } from "../../../../base/enums";
import { LuPlus } from "react-icons/lu";
import { useIsViewVisible } from "../../../../hooks/useIsViewVisible";
import { useSchoolSubjectColors } from "../../../../hooks/useSchoolSubjectColors";
import { useSchoolSubjectTopicEntities } from "../../hooks/useSchoolSubjectTopicEntities";
import NoContentAdded from "../../../../components/content/NoContentAdded";
import { dataTypeQuery, isChildOfQuery } from "../../../../utils/queries";
import TopicCell from "../topisc/TopicCell";

const SchoolSubjectView = (props: TitleProps & EntityProps) => {
  const { title, entity } = props;
  const isVisible = useIsViewVisible(entity);
  const { color, backgroundColor } = useSchoolSubjectColors(props.entity);
  const { hasTopics } = useSchoolSubjectTopicEntities(props.entity);

  const handleNavigateBack = () => entity.addTag(AdditionalTags.NAVIGATE_BACK);

  return (
    <View visibe={isVisible}>
      <NavigationBar
        backButtonLabel="Sammlung"
        navigateBack={handleNavigateBack}
      >
        <LuPlus />
      </NavigationBar>

      {hasTopics && <Title>{title} </Title>}
      <Spacer />  
      {!hasTopics && (
        <NoContentAdded backgroundColor={backgroundColor} color={color} />
      )}

      <CollectionLayout>
        <EntityPropsMapper
          query={(e) =>
            dataTypeQuery(e, DataTypes.TOPIC) && isChildOfQuery(e, entity)
          }
          get={[[TitleFacet], []]}
          onMatch={TopicCell}
        />
      </CollectionLayout>
    </View>
  );
};

export default SchoolSubjectView;
