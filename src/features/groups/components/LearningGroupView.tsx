import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { EntityProps, EntityPropsMapper } from '@leanscope/ecs-engine';
import { ColorProps, DescriptionProps, OrderFacet, Tags } from '@leanscope/ecs-models';
import { useContext } from 'react';
import { IoCreateOutline, IoEllipsisHorizontalCircleOutline, IoTrashOutline } from 'react-icons/io5';
import { Fragment } from 'react/jsx-runtime';
import { useIsViewVisible } from '../../../common/hooks/useIsViewVisible';
import { useSelectedLanguage } from '../../../common/hooks/useSelectedLanguage';
import { TitleFacet, TitleProps } from '../../../common/types/additionalFacets';
import { AdditionalTag, DataType, Story } from '../../../common/types/enums';
import { displayActionTexts, displayAlertTexts, displayHeaderTexts } from '../../../common/utilities/displayText';
import { dataTypeQuery, isChildOfQuery } from '../../../common/utilities/queries';
import {
  ActionRow,
  BackButton,
  CollectionGrid,
  NavBarButton,
  NavigationBar,
  SecondaryText,
  Spacer,
  Title,
  View,
} from '../../../components';
import { SchoolSubjectCell } from '../../collection';
import LoadLearningGroupSchoolSubjectsSystem from '../systems/LoadLearningGroupSchoolSubjectsSystem';
import DeleteLearningGroupAlert from './DeleteLearningGroupAlert';
import EditLearningGroupSheet from './EditLearningGroupSheet';
import GroupSchoolSubjectView from './school-subjects/GroupSchoolSubjectView';

const LearningGroupView = (props: TitleProps & DescriptionProps & ColorProps & EntityProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, description, entity } = props;
  const isVisible = useIsViewVisible(entity);
  const { selectedLanguage } = useSelectedLanguage();

  const navigateBack = () => entity.add(AdditionalTag.NAVIGATE_BACK);
  const openEditLearningGroupSheet = () => lsc.stories.transitTo(Story.EDITING_LEARNING_GROUP_STORY);
  const openDeleteLearningGroupAlert = () => lsc.stories.transitTo(Story.DELETING_LERNING_GROUP_STORY);

  return (
    <Fragment>
      <LoadLearningGroupSchoolSubjectsSystem />

      <View visible={isVisible}>
        <NavigationBar>
          <NavBarButton
            content={
              <Fragment>
                <ActionRow first onClick={openEditLearningGroupSheet} icon={<IoCreateOutline />}>
                  {displayActionTexts(selectedLanguage).edit}
                </ActionRow>
                <ActionRow destructive last onClick={openDeleteLearningGroupAlert} icon={<IoTrashOutline />}>
                  {displayActionTexts(selectedLanguage).delete}
                </ActionRow>
              </Fragment>
            }
          >
            <IoEllipsisHorizontalCircleOutline />
          </NavBarButton>
        </NavigationBar>

        <BackButton navigateBack={navigateBack}>{displayHeaderTexts(selectedLanguage).groups}</BackButton>

        <Title>{title || displayAlertTexts(selectedLanguage).noTitle}</Title>
        <Spacer size={2} />
        <SecondaryText>{description || displayAlertTexts(selectedLanguage).noDescription}</SecondaryText>
        <Spacer size={6} />

        <CollectionGrid>
          <EntityPropsMapper
            query={(e) => dataTypeQuery(e, DataType.GROUP_SCHOOL_SUBJECT) && isChildOfQuery(e, entity)}
            get={[[OrderFacet, TitleFacet], []]}
            onMatch={SchoolSubjectCell}
          />
        </CollectionGrid>
      </View>

      <EntityPropsMapper
        query={(e) =>
          dataTypeQuery(e, DataType.GROUP_SCHOOL_SUBJECT) && isChildOfQuery(e, entity) && e.has(Tags.SELECTED)
        }
        get={[[TitleFacet], []]}
        onMatch={GroupSchoolSubjectView}
      />

      <EditLearningGroupSheet />
      <DeleteLearningGroupAlert />
    </Fragment>
  );
};

export default LearningGroupView;
