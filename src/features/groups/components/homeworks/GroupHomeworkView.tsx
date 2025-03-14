import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { EntityProps } from '@leanscope/ecs-engine';
import { IdentifierProps } from '@leanscope/ecs-models';
import { useContext } from 'react';
import { IoCreateOutline, IoTrashOutline } from 'react-icons/io5';
import { Fragment } from 'react/jsx-runtime';
import { useIsViewVisible } from '../../../../common/hooks/useIsViewVisible';
import { useSelectedLanguage } from '../../../../common/hooks/useSelectedLanguage';
import { TitleProps } from '../../../../common/types/additionalFacets';
import { AdditionalTag, Story } from '../../../../common/types/enums';
import { displayActionTexts } from '../../../../common/utilities/displayText';
import { ActionRow, View } from '../../../../components';
import Blockeditor from '../../../blockeditor/components/Blockeditor';
import InitializeBlockeditorSystem from '../../../blockeditor/systems/InitializeBlockeditorSystem';
import { useSelectedGroupTopic } from '../../hooks/useSelectedGroupTopic';
import DeleteGroupHomeworkAlert from './DeleteGroupHomeworkAlert';
import EditGroupHomeworkSheet from './EditGroupHomeworkSheet';

const GroupHomeworkView = (props: EntityProps & TitleProps & IdentifierProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, guid, entity } = props;
  const isVisible = useIsViewVisible(entity);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedGroupTopicTitle } = useSelectedGroupTopic();

  const navigateBack = () => entity.addTag(AdditionalTag.NAVIGATE_BACK);
  const openEditGroupHomeworkSheet = () => lsc.stories.transitTo(Story.EDITING_GROUP_HOMEWORK_STORY);
  const openDeleteGroupHomeworkAlert = () => lsc.stories.transitTo(Story.DELETING_GROUP_HOMEWORK_STORY);

  return (
    <Fragment>
      <InitializeBlockeditorSystem blockeditorId={guid} />

      <View visible={isVisible}>
        <Blockeditor
          title={title}
          id={guid}
          backbuttonLabel={selectedGroupTopicTitle}
          navigateBack={navigateBack}
          customActionRows={
            <Fragment>
              <ActionRow first onClick={openEditGroupHomeworkSheet} icon={<IoCreateOutline />}>
                {displayActionTexts(selectedLanguage).edit}
              </ActionRow>
              <ActionRow onClick={openDeleteGroupHomeworkAlert} icon={<IoTrashOutline />} destructive last>
                {displayActionTexts(selectedLanguage).delete}
              </ActionRow>
            </Fragment>
          }
        />
      </View>

      <DeleteGroupHomeworkAlert />
      <EditGroupHomeworkSheet />
    </Fragment>
  );
};

export default GroupHomeworkView;
