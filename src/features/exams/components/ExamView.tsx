import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { EntityProps } from '@leanscope/ecs-engine';
import { IdentifierProps, TextFacet, TextProps } from '@leanscope/ecs-models';
import { useContext } from 'react';
import { IoCreateOutline, IoEllipsisHorizontalCircleOutline, IoTrashOutline } from 'react-icons/io5';
import { Fragment } from 'react/jsx-runtime';
import { useIsViewVisible } from '../../../common/hooks/useIsViewVisible';
import { useSelectedLanguage } from '../../../common/hooks/useSelectedLanguage';
import { TitleProps } from '../../../common/types/additionalFacets';
import { AdditionalTag, Story, SupabaseColumn, SupabaseTable } from '../../../common/types/enums';
import { displayActionTexts, displayButtonTexts, displayHeaderTexts } from '../../../common/utilities/displayText';
import {
  ActionRow,
  BackButton,
  NavBarButton,
  NavigationBar,
  Spacer,
  TextEditor,
  Title,
  View,
} from '../../../components';
import supabaseClient from '../../../lib/supabase';
import LoadExamTextSystem from '../systems/LoadExamTextSystem';
import DeleteExamAlert from './DeleteExamAlert';
import EditExamSheet from './EditExamSheet';

const ExamView = (props: TitleProps & TextProps & IdentifierProps & EntityProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { title, text, guid, entity } = props;
  const isVisible = useIsViewVisible(entity);
  const { selectedLanguage } = useSelectedLanguage();

  const navigateBack = () => entity.add(AdditionalTag.NAVIGATE_BACK);
  const openEditExamSheet = () => lsc.stories.transitTo(Story.EDITING_EXAM_STORY);
  const openDeleteExamAlert = () => lsc.stories.transitTo(Story.DELETING_EXAM_STORY);

  const handleTextBlur = async (value: string) => {
    entity.add(new TextFacet({ text: value }));
    const { error } = await supabaseClient
      .from(SupabaseTable.EXAMS)
      .update({ text: value })
      .eq(SupabaseColumn.ID, guid);

    if (error) {
      console.error('Error updating exam text', error);
    }
  };

  return (
    <Fragment>
      <LoadExamTextSystem />

      <View visible={isVisible}>
        <NavigationBar>
          <NavBarButton
            content={
              <Fragment>
                <ActionRow onClick={openEditExamSheet} icon={<IoCreateOutline />} first>
                  {displayActionTexts(selectedLanguage).edit}
                </ActionRow>
                <ActionRow onClick={openDeleteExamAlert} icon={<IoTrashOutline />} last destructive>
                  {displayActionTexts(selectedLanguage).delete}
                </ActionRow>
              </Fragment>
            }
          >
            <IoEllipsisHorizontalCircleOutline />
          </NavBarButton>
        </NavigationBar>
        <BackButton navigateBack={navigateBack}>
          {displayHeaderTexts(selectedLanguage).exams || displayButtonTexts(selectedLanguage).back}
        </BackButton>
        <Title>{title}</Title>
        <Spacer />
        <TextEditor placeholder="Beginne hier..." value={text} onBlur={handleTextBlur} />
      </View>

      <EditExamSheet />
      <DeleteExamAlert />
    </Fragment>
  );
};

export default ExamView;
