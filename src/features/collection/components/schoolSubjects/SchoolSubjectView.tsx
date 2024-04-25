import React, { useContext } from "react";
import { TitleFacet, TitleProps } from "../../../../app/AdditionalFacets";
import { EntityProps, EntityPropsMapper } from "@leanscope/ecs-engine";
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
import { sortEntitiesByDateAdded } from "../../../../utils/sortEntitiesByTime";
import { Tags } from "@leanscope/ecs-models";
import TopicView from "../topics/TopicView";
import { useSelectedTopic } from "../../hooks/useSelectedTopic";

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
    <>
      <View visibe={isVisible}>
        <NavigationBar>
          <LuPlus onClick={openAddTopicSheet} />
        </NavigationBar>
        <BackButton navigateBack={navigateBack}>
          {displayHeaderTexts(selectedLanguage).collectionHeaderText}
        </BackButton>
        <Title>{title} </Title>
        <Spacer size={6} />
        {!hasTopics && (
          <NoContentAdded backgroundColor={backgroundColor} color={color} />
        )}
        <CollectionGrid columnSize="large">
          <EntityPropsMapper
            query={(e) =>
              dataTypeQuery(e, DataTypes.TOPIC) && isChildOfQuery(e, entity)
            }
            sort={(a, b) => sortEntitiesByDateAdded(a, b)}
            get={[[TitleFacet], []]}
            onMatch={TopicCell}
          />
        </CollectionGrid>
        <AddTopicSheet />
      </View>
      <EntityPropsMapper
        query={(e) =>
          dataTypeQuery(e, DataTypes.TOPIC) && e.hasTag(Tags.SELECTED)
        }
        get={[[TitleFacet], []]}
        onMatch={TopicView}
      />
    </>
  );
};

export default SchoolSubjectView;
