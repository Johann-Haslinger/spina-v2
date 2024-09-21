import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity, EntityProps } from '@leanscope/ecs-engine';
import { IdentifierFacet, IdentifierProps, TextFacet, TextProps } from '@leanscope/ecs-models';
import { useContext } from 'react';
import { IoCreateOutline, IoEllipsisHorizontalCircleOutline, IoShareOutline, IoTrashOutline } from 'react-icons/io5';
import { TitleProps } from '../../../../app/additionalFacets';
import { AdditionalTag, Story, SupabaseTable } from '../../../../base/enums';
import { generatePdf } from '../../../../common/utilities';
import {
  ActionRow,
  BackButton,
  NavBarButton,
  NavigationBar,
  SecondaryText,
  Spacer,
  TextEditor,
  Title,
  View,
} from '../../../../components';
import { useDaysUntilDue } from '../../../../hooks/useDaysUntilDue';
import { useIsViewVisible } from '../../../../hooks/useIsViewVisible';
import { useSelectedLanguage } from '../../../../hooks/useSelectedLanguage';
import supabaseClient from '../../../../lib/supabase';
import { displayActionTexts, displayButtonTexts } from '../../../../utils/displayText';
import { useSelectedTopic } from '../../hooks/useSelectedTopic';
import LoadHomeworkTextSystem from '../../systems/LoadHomeworkTextSystem';
import DeleteHomeworkAlert from './DeleteHomeworkAlert';
import EditHomeworkSheet from './EditHomeworkSheet';

const updateText = async (text: string, entity: Entity) => {
  entity.add(new TextFacet({ text }));

  const id = entity.get(IdentifierFacet)?.props.guid;

  const { error } = await supabaseClient.from(SupabaseTable.HOMEWORKS).update({ text }).eq('id', id);

  if (error) {
    console.error('Error updating homework text:', error);
  }
};

const HomeworkView = (props: EntityProps & TitleProps & TextProps & IdentifierProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, entity, text } = props;
  const isVisible = useIsViewVisible(entity);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedTopicTitle } = useSelectedTopic();

  const daysUntilDue = useDaysUntilDue(entity);

  const navigateBack = () => entity.addTag(AdditionalTag.NAVIGATE_BACK);
  const openEditHomeworkSheet = () => lsc.stories.transitTo(Story.EDITING_HOMEWORK_STORY);
  const openDeleteHomeworkAlert = () => lsc.stories.transitTo(Story.DELETING_HOMEWORK_STORY);
  const exportHomework = () => generatePdf(title, text);

  return (
    <div>
      <LoadHomeworkTextSystem />

      <View visible={isVisible}>
        <NavigationBar>
          <NavBarButton
            content={
              <div>
                <ActionRow first onClick={openEditHomeworkSheet} icon={<IoCreateOutline />}>
                  {displayActionTexts(selectedLanguage).edit}
                </ActionRow>
                <ActionRow icon={<IoShareOutline />} onClick={exportHomework}>
                  Als PDF exportieren
                </ActionRow>
                <ActionRow onClick={openDeleteHomeworkAlert} icon={<IoTrashOutline />} destructive last>
                  {displayActionTexts(selectedLanguage).delete}
                </ActionRow>
              </div>
            }
          >
            <IoEllipsisHorizontalCircleOutline />
          </NavBarButton>
        </NavigationBar>

        <BackButton navigateBack={navigateBack}>
          {selectedTopicTitle || displayButtonTexts(selectedLanguage).back}
        </BackButton>
        <Title>{title}</Title>
        <Spacer size={2} />
        <SecondaryText>{daysUntilDue}</SecondaryText>
        <Spacer size={6} />
        <TextEditor placeholder="Beginne hier..." value={text} onBlur={(e) => updateText(e, entity)} />
      </View>

      <DeleteHomeworkAlert />
      <EditHomeworkSheet />
    </div>
  );
};

export default HomeworkView;
