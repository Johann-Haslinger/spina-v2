import { LeanScopeClientContext } from "@leanscope/api-client/node";
import { EntityProps, EntityPropsMapper } from "@leanscope/ecs-engine";
import { DescriptionFacet, Tags } from "@leanscope/ecs-models";
import { Fragment, useContext } from "react";
import { IoAdd } from "react-icons/io5";
import { TitleFacet, TitleProps } from "../../../../app/additionalFacets";
import { AdditionalTags, DataTypes, Stories } from "../../../../base/enums";
import { BackButton, CollectionGrid, NavBarButton, NavigationBar, Spacer, Title, View } from "../../../../components";
import NoContentAddedHint from "../../../../components/content/NoContentAddedHint";
import { useIsViewVisible } from "../../../../hooks/useIsViewVisible";
import { useSelectedLanguage } from "../../../../hooks/useSelectedLanguage";
import { displayHeaderTexts } from "../../../../utils/displayText";
import { dataTypeQuery, isChildOfQuery } from "../../../../utils/queries";
import { sortEntitiesByDateAdded } from "../../../../utils/sortEntitiesByTime";
import { useSchoolSubjectTopicEntities } from "../../hooks/useSchoolSubjectTopicEntities";
import LoadTopicsSystem from "../../systems/LoadTopicsSystem";
import TopicCell from "../topics/TopicCell";
import TopicView from "../topics/TopicView";
import AddTopicSheet from "./AddTopicSheet";

const SchoolSubjectView = (props: TitleProps & EntityProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, entity } = props;
  const isVisible = useIsViewVisible(entity);
  const { hasTopics } = useSchoolSubjectTopicEntities(props.entity);
  const { selectedLanguage } = useSelectedLanguage();

  const navigateBack = () => entity.addTag(AdditionalTags.NAVIGATE_BACK);
  const openAddTopicSheet = () => lsc.stories.transitTo(Stories.ADDING_TOPIC_STORY);

  return (
    <Fragment>
      <LoadTopicsSystem />

      <View visible={isVisible}>
        <NavigationBar>
          <NavBarButton>
            <IoAdd onClick={openAddTopicSheet} />
          </NavBarButton>
        </NavigationBar>

        <BackButton navigateBack={navigateBack}>{displayHeaderTexts(selectedLanguage).collection}</BackButton>
        <Title>{title}</Title>
        <Spacer size={6} />
        {!hasTopics && <NoContentAddedHint />}
        <CollectionGrid columnSize="large">
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataTypes.TOPIC) && isChildOfQuery(e, entity)}
            sort={(a, b) => sortEntitiesByDateAdded(a, b)}
            get={[[TitleFacet, DescriptionFacet], []]}
            onMatch={TopicCell}
          />
        </CollectionGrid>
      </View>

      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataTypes.TOPIC) && e.hasTag(Tags.SELECTED)}
        get={[[TitleFacet, DescriptionFacet], []]}
        onMatch={TopicView}
      />

      <AddTopicSheet />
    </Fragment>
  );
};

export default SchoolSubjectView;
