import { LeanScopeClientContext } from '@leanscope/api-client/node';
import { EntityProps } from '@leanscope/ecs-engine';
import { IdentifierProps, TextProps } from '@leanscope/ecs-models';
import { Fragment, useContext } from 'react';
import { IoCreateOutline, IoEllipsisHorizontalCircleOutline, IoTrashOutline } from 'react-icons/io5';
import { TitleProps } from '../../../../app/additionalFacets';
import { AdditionalTags, Story } from '../../../../base/enums';
import {
  ActionRow,
  BackButton,
  NavBarButton,
  NavigationBar,
  Spacer,
  TextEditor,
  Title,
  View,
} from '../../../../components';
import { useIsViewVisible } from '../../../../hooks/useIsViewVisible';
import { useSelectedLanguage } from '../../../../hooks/useSelectedLanguage';
import { displayActionTexts, displayButtonTexts } from '../../../../utils/displayText';
import { useSelectedTopic } from '../../hooks/useSelectedTopic';
import { useText } from '../../hooks/useText';
import LoadHomeworkTextSystem from '../../systems/LoadHomeworkTextSystem';
import DeleteHomeworkAlert from './DeleteHomeworkAlert';
import EditHomeworkSheet from './EditHomeworkSheet';

const HomeworkView = (props: EntityProps & TitleProps & TextProps & IdentifierProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, entity } = props;
  const isVisible = useIsViewVisible(entity);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedTopicTitle } = useSelectedTopic();
  const { text, updateText } = useText(entity);

  const navigateBack = () => entity.addTag(AdditionalTags.NAVIGATE_BACK);
  const openEditHomeworkSheet = () => lsc.stories.transitTo(Story.EDITING_HOMEWORK_STORY);
  const openDeleteHomeworkAlert = () => lsc.stories.transitTo(Story.DELETING_HOMEWORK_STORY);

  return (
    <Fragment>
      <LoadHomeworkTextSystem />

      <View visible={isVisible}>
        <NavigationBar>
          <NavBarButton
            content={
              <Fragment>
                <ActionRow first onClick={openEditHomeworkSheet} icon={<IoCreateOutline />}>
                  {displayActionTexts(selectedLanguage).edit}
                </ActionRow>
                <ActionRow onClick={openDeleteHomeworkAlert} icon={<IoTrashOutline />} destructive last>
                  {displayActionTexts(selectedLanguage).delete}
                </ActionRow>
              </Fragment>
            }
          >
            <IoEllipsisHorizontalCircleOutline />
          </NavBarButton>
        </NavigationBar>

        <BackButton navigateBack={navigateBack}>
          {selectedTopicTitle || displayButtonTexts(selectedLanguage).back}
        </BackButton>
        <Title>{title}</Title>
        <Spacer />
        <TextEditor placeholder="Beginne hier..." value={text} onBlur={updateText} />
      </View>

      <DeleteHomeworkAlert />
      <EditHomeworkSheet />
    </Fragment>
  );
};

export default HomeworkView;
