import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { EntityPropsMapper } from '@leanscope/ecs-engine';
import { ColorFacet, DescriptionFacet, Tags } from '@leanscope/ecs-models';
import { useContext } from 'react';
import { IoCreateOutline } from 'react-icons/io5';
import { Fragment } from 'react/jsx-runtime';
import { useSelectedLanguage } from '../common/hooks/useSelectedLanguage';
import { TitleFacet } from '../common/types/additionalFacets';
import { DataType, Story } from '../common/types/enums';
import { displayHeaderTexts } from '../common/utilities/displayText';
import { dataTypeQuery } from '../common/utilities/queries';
import { CollectionGrid, NavBarButton, NavigationBar, NoContentAddedHint, Spacer, Title, View } from '../components';
import { LearningGroupCell, LearningGroupView } from '../features/groups';
import AddLearningGroupSheet from '../features/groups/components/AddLearningGroupSheet';
import { useLearningGroups } from '../features/groups/hooks/useLearningGroups';
import InitializeLearningGroupsSystem from '../features/groups/systems/InitializeLearningGroupsSystem';

const Groups = () => {
  const lsc = useContext(LeanScopeClientContext);
  const { selectedLanguage } = useSelectedLanguage();
  const { existLearningGroups } = useLearningGroups();

  const openAddLearningGroupSheet = () => lsc.stories.transitTo(Story.ADDING_LERNING_GROUP_STORY);

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
            query={(e) => dataTypeQuery(e, DataType.LEARNING_GROUP)}
            get={[[TitleFacet, ColorFacet, DescriptionFacet], []]}
            onMatch={LearningGroupCell}
          />
        </CollectionGrid>

        {!existLearningGroups && <NoContentAddedHint />}
      </View>

      <EntityPropsMapper
        query={(e) => dataTypeQuery(e, DataType.LEARNING_GROUP) && e.has(Tags.SELECTED)}
        get={[[TitleFacet, ColorFacet, DescriptionFacet], []]}
        onMatch={LearningGroupView}
      />

      <AddLearningGroupSheet />
    </Fragment>
  );
};

export default Groups;
