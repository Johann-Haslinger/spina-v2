import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity, EntityProps } from '@leanscope/ecs-engine';
import { IdentifierFacet, IdentifierProps } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useState } from 'react';
import { IoAddCircle, IoRemoveCircle } from 'react-icons/io5';
import { v4 } from 'uuid';
import { TitleFacet, TitleProps } from '../../../app/additionalFacets';
import { SCHOOL_SUBJECTS } from '../../../base/constants';
import { DataType, Story, SupabaseTable } from '../../../base/enums';
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
import { useSchoolSubjectEntities } from '../../../hooks/useSchoolSubjects';
import { useSelectedLanguage } from '../../../hooks/useSelectedLanguage';
import { useUserData } from '../../../hooks/useUserData';
import supabaseClient from '../../../lib/supabase';
import { displayActionTexts } from '../../../utils/displayText';

const removeSchoolSubject = async (subjectId: string) => {
  const { error } = await supabaseClient.from(SupabaseTable.SCHOOL_SUBJECTS).delete().eq('id', subjectId).single();

  if (error) {
    console.error('Error deleting subject:', error.message);
  }
};

const addSubject = async (subjectEntity: Entity, userId: string) => {
  const { error } = await supabaseClient.from(SupabaseTable.SCHOOL_SUBJECTS).insert([
    {
      title: subjectEntity.get(TitleFacet)?.props.title,
      user_id: userId,
      id: subjectEntity.get(IdentifierFacet)?.props.guid,
    },
  ]);

  if (error) {
    console.error('Error adding subject:', error.message);
  }
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
    lsc.engine.addEntity(newSchoolSubjectEntity);
    newSchoolSubjectEntity.add(new TitleFacet({ title: schoolSubjectName }));
    newSchoolSubjectEntity.add(new IdentifierFacet({ guid: v4() }));
    newSchoolSubjectEntity.add(DataType.SCHOOL_SUBJECT);

    addSubject(newSchoolSubjectEntity, userId);
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
        <Spacer />
        <Section>
          {findMissingSubjects().map((subject, idx) => (
            <SectionRow
              icon={<IoAddCircle />}
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
    lsc.engine.removeEntity(entity);

    const schoolSubjectId = entity.get(IdentifierFacet)?.props.guid || '';
    removeSchoolSubject(schoolSubjectId);
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
