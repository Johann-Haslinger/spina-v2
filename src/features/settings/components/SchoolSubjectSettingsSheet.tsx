import { ILeanScopeClient } from '@leanscope/api-client';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity, EntityProps } from '@leanscope/ecs-engine';
import { IdentifierFacet, IdentifierProps } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useState } from 'react';
import { IoAddCircle, IoRemoveCircle } from 'react-icons/io5';
import { v4 } from 'uuid';
import { useSchoolSubjectEntities } from '../../../common/hooks/useSchoolSubjects';
import { useSelectedLanguage } from '../../../common/hooks/useSelectedLanguage';
import { useUserData } from '../../../common/hooks/useUserData';
import { TitleFacet, TitleProps } from '../../../common/types/additionalFacets';
import { SCHOOL_SUBJECTS } from '../../../common/types/constants';
import { DataType, Story, SupabaseTable } from '../../../common/types/enums';
import { addNotificationEntity } from '../../../common/utilities';
import { displayActionTexts } from '../../../common/utilities/displayText';
import {
  Alert,
  AlertButton,
  CloseButton,
  FlexBox,
  ScrollableBox,
  Section,
  SectionRow,
  Sheet,
  Spacer,
} from '../../../components';
import supabaseClient from '../../../lib/supabase';

const removeSchoolSubject = async (lsc: ILeanScopeClient, subjectId: string, subjectEntity: Entity) => {
  const { error } = await supabaseClient.from(SupabaseTable.SCHOOL_SUBJECTS).delete().eq('id', subjectId).single();

  if (error) {
    console.error('Error deleting subject:', error.message);
    addNotificationEntity(lsc, {
      title: 'Fehler beim Löschen des Schulfachs',
      message: error.message,
      type: 'error',
    });
  }

  lsc.engine.removeEntity(subjectEntity);
};

const addSubject = async (lsc: ILeanScopeClient, subjectEntity: Entity, userId: string) => {
  const { error } = await supabaseClient.from(SupabaseTable.SCHOOL_SUBJECTS).insert([
    {
      title: subjectEntity.get(TitleFacet)?.props.title,
      user_id: userId,
      id: subjectEntity.get(IdentifierFacet)?.props.guid,
    },
  ]);

  if (error) {
    console.error('Error adding subject:', error.message);

    addNotificationEntity(lsc, {
      title: 'Fehler beim Hinzufügen des Schulfachs',
      message: error.message,
      type: 'error',
    });

    return;
  }

  lsc.engine.addEntity(subjectEntity);
};

const SchoolSubjectSettingsSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.OBSERVING_SCHOOL_SUBJECT_SETTINGS_STORY);
  const schoolSubjectEntities = useSchoolSubjectEntities();
  const { userId } = useUserData();

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_SETTINGS_OVERVIEW_STORY);

  const findMissingSubjects = () => {
    const missingSubjects: string[] = [];

    for (const subject of SCHOOL_SUBJECTS) {
      const isMissing = !schoolSubjectEntities.some((s) => s.get(TitleFacet)?.props.title === subject);
      if (isMissing) {
        missingSubjects.push(subject);
      }
    }

    return missingSubjects;
  };

  const handleAddSubject = (schoolSubjectName: string) => {
    const newSchoolSubjectEntity = new Entity();
    newSchoolSubjectEntity.add(new TitleFacet({ title: schoolSubjectName }));
    newSchoolSubjectEntity.add(new IdentifierFacet({ guid: v4() }));
    newSchoolSubjectEntity.add(DataType.SCHOOL_SUBJECT);

    addSubject(lsc, newSchoolSubjectEntity, userId);
  };

  return (
    <Sheet navigateBack={navigateBack} visible={isVisible}>
      <FlexBox>
        <div />
        <CloseButton onClick={navigateBack} />
      </FlexBox>
      <Spacer />
      <ScrollableBox>
        <Section>
          {schoolSubjectEntities.map((schoolSubjectEntity, idx) => (
            <SchoolSubjectCell
              isLast={idx === schoolSubjectEntities.length - 1}
              key={idx}
              title={schoolSubjectEntity.get(TitleFacet)?.props.title || ''}
              guid={schoolSubjectEntity.get(IdentifierFacet)?.props.guid || ''}
              entity={schoolSubjectEntity}
            />
          ))}
        </Section>
        <Spacer size={2} />
        <Section>
          {findMissingSubjects().map((subject, idx) => (
            <SectionRow
              icon={<IoAddCircle color="#3b82f6" />}
              key={idx}
              last={idx == findMissingSubjects().length - 1}
              onClick={() => handleAddSubject(subject)}
            >
              {subject}
            </SectionRow>
          ))}
        </Section>
      </ScrollableBox>
    </Sheet>
  );
};

export default SchoolSubjectSettingsSheet;

const SchoolSubjectCell = (props: EntityProps & TitleProps & IdentifierProps & { isLast: boolean }) => {
  const { title, entity, isLast } = props;
  const lsc = useContext(LeanScopeClientContext);
  const [isDeleteAlertVisible, setIsDeleteAlertVisible] = useState(false);
  const { selectedLanguage } = useSelectedLanguage();

  const navigateBack = () => setIsDeleteAlertVisible(false);

  const handleRemoveSchoolSubject = (entity: Entity) => {
    navigateBack();
    const schoolSubjectId = entity.get(IdentifierFacet)?.props.guid || '';
    removeSchoolSubject(lsc, schoolSubjectId, entity);
  };

  return (
    <div>
      <SectionRow last={isLast} icon={<IoRemoveCircle color="#ef4444" onClick={() => setIsDeleteAlertVisible(true)} />}>
        {title}
      </SectionRow>

      <Alert navigateBack={navigateBack} visible={isDeleteAlertVisible}>
        <AlertButton onClick={navigateBack} role="primary">
          {displayActionTexts(selectedLanguage).cancel}
        </AlertButton>
        <AlertButton onClick={() => handleRemoveSchoolSubject(entity)} role="destructive">
          {displayActionTexts(selectedLanguage).delete}
        </AlertButton>
      </Alert>
    </div>
  );
};
