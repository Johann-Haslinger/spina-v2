import { EntityPropsMapper } from "@leanscope/ecs-engine";
import { ColorFacet, DescriptionFacet, Tags } from "@leanscope/ecs-models";
import { IoCreateOutline } from "react-icons/io5";
import { Fragment } from "react/jsx-runtime";
import { TitleFacet } from "../app/additionalFacets";
import { DataTypes, Stories } from "../base/enums";
import {
  CollectionGrid,
  NavBarButton,
  NavigationBar,
  NoContentAddedHint,
  Spacer,
  Title,
  View,
} from "../components";
import { LearningGroupCell, LearningGroupView } from "../features/groups";
import { useLearningGroups } from "../features/groups/hooks/useLearningGroups";
import InitializeLearningGroupsSystem from "../features/groups/systems/InitializeLearningGroupsSystem";
import { useSelectedLanguage } from "../hooks/useSelectedLanguage";
import { displayHeaderTexts } from "../utils/displayText";
import { dataTypeQuery } from "../utils/queries";
import AddLearningGroupSheet from "../features/groups/components/AddLearningGroupSheet";
import { useContext } from "react";
import { LeanScopeClientContext } from "@leanscope/api-client/node";

const Groups = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { selectedLanguage } = useSelectedLanguage();
  const { existLearningGroups } = useLearningGroups();

  const openAddLearningGroupSheet = () =>
    lsc.stories.transitTo(Stories.ADDING_LERNING_GROUP_STORY);

  return (
    <Fragment>
      <InitializeLearningGroupsSystem />

      <View viewType="baseView">
        <NavigationBar>
          <NavBarButton onClick={openAddLearningGroupSheet}>
            <IoCreateOutline />
          </NavBarButton>
        </NavigationBar>

        <Spacer size={8} />
        <Title>{displayHeaderTexts(selectedLanguage).groups}</Title>
        <Spacer />
        <CollectionGrid columnSize="large">
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataTypes.LEARNING_GROUP)}
            get={[[TitleFacet, ColorFacet, DescriptionFacet], []]}
            onMatch={LearningGroupCell}
          />
        </CollectionGrid>

        {!existLearningGroups && <NoContentAddedHint />}
      </View>

      <EntityPropsMapper
        query={(e) =>
          dataTypeQuery(e, DataTypes.LEARNING_GROUP) && e.has(Tags.SELECTED)
        }
        get={[[TitleFacet, ColorFacet, DescriptionFacet], []]}
        onMatch={LearningGroupView}
      />

      <AddLearningGroupSheet />
    </Fragment>
  );
};

export default Groups;
