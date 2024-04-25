import React, { useContext } from "react";
import { TitleFacet, TitleProps } from "../../../../app/AdditionalFacets";
import {
  EntityProps,
  EntityPropsMapper,
} from "@leanscope/ecs-engine";
import {
  BackButton,
  CollectionGrid,
  NavigationBar,
  Spacer,
  Title,
  View,
} from "../../../../components";
import { AdditionalTags, DataTypes, StoryGuid } from "../../../../base/enums";
import { LuPlus } from "react-icons/lu";
import { useIsViewVisible } from "../../../../hooks/useIsViewVisible";
import { useSchoolSubjectColors } from "../../../../hooks/useSchoolSubjectColors";
import { useSchoolSubjectTopics } from "../../hooks/useSchoolSubjectTopics";
import NoContentAdded from "../../../../components/content/NoContentAdded";
import { dataTypeQuery, isChildOfQuery } from "../../../../utils/queries";
import TopicCell from "../topics/TopicCell";
import { LeanScopeClientContext } from "@leanscope/api-client/node";
import AddTopicSheet from "./AddTopicSheet";
import { displayHeaderTexts } from "../../../../utils/selectDisplayText";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";

const SchoolSubjectView = (props: TitleProps & EntityProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, entity } = props;
  const isVisible = useIsViewVisible(entity);
  const { color, backgroundColor } = useSchoolSubjectColors(props.entity);
  const { hasTopics } = useSchoolSubjectTopics(props.entity);
  const { selectedLanguage } = useSelectedLanguage();

  const navigateBack = () => entity.addTag(AdditionalTags.NAVIGATE_BACK);
  const openAddTopicSheet = () =>
    lsc.stories.transitTo(StoryGuid.ADD_NEW_TOPIC_STORY);

  return (
    <View visibe={isVisible}>
      <NavigationBar>
        <LuPlus onClick={openAddTopicSheet} />
      </NavigationBar>
      <BackButton navigateBack={navigateBack}>
        {displayHeaderTexts(selectedLanguage).collectionHeaderText}
      </BackButton>
      <Title>{title} </Title>
      <Spacer />
      {!hasTopics && (
        <NoContentAdded backgroundColor={backgroundColor} color={color} />
      )}
      <CollectionGrid columnSize="large">
        <EntityPropsMapper
          query={(e) =>
            dataTypeQuery(e, DataTypes.TOPIC) && isChildOfQuery(e, entity)
          }
          get={[[TitleFacet], []]}
          onMatch={TopicCell}
        />
      </CollectionGrid>
      <AddTopicSheet />
    </View>
  );
};

export default SchoolSubjectView;
