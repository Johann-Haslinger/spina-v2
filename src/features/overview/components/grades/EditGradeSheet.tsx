import { ILeanScopeClient } from '@leanscope/api-client';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity, EntityProps, useEntities, useEntityHasTags } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet, ParentProps, Tags } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useEffect, useState } from 'react';
import { IoTrashOutline } from 'react-icons/io5';
import { useGradeTypes } from '../../../../common/hooks';
import { useIsViewVisible } from '../../../../common/hooks/useIsViewVisible';
import { useSchoolSubjectEntities } from '../../../../common/hooks/useSchoolSubjects';
import { useSelectedLanguage } from '../../../../common/hooks/useSelectedLanguage';
import {
  DateAddedFacet,
  DateAddedProps,
  TitleFacet,
  TypeFacet,
  TypeProps,
  ValueFacet,
  ValueProps,
} from '../../../../common/types/additionalFacets';
import { AdditionalTag, DataType, Story, SupabaseTable } from '../../../../common/types/enums';
import { addNotificationEntity } from '../../../../common/utilities';
import { displayActionTexts, displayButtonTexts, displayLabelTexts } from '../../../../common/utilities/displayText';
import {
  Alert,
  AlertButton,
  FlexBox,
  PrimaryButton,
  SecondaryButton,
  Section,
  SectionRow,
  SelectInput,
  Sheet,
  Spacer,
  TextInput,
} from '../../../../components';
import supabaseClient from '../../../../lib/supabase';

const updateGrade = async (lsc: ILeanScopeClient, entity: Entity, updatedGrade: any) => {
  const { error } = await supabaseClient
    .from(SupabaseTable.GRADES)
    .update({
      value: updatedGrade.value,
      type_id: updatedGrade.type,
      parent_id: updatedGrade.parentId,
    })
    .eq('id', entity.get(IdentifierFacet)?.props.guid);

  if (error) {
    console.error('Error updating grade: ', error);
    addNotificationEntity(lsc, {
      title: 'Fehler beim Aktualisieren deiner Note',
      message: error.message,
      type: 'error',
    });
    return;
  }
  const newGradeEntity = new Entity();
  lsc.engine.addEntity(newGradeEntity);
  newGradeEntity.add(new IdentifierFacet({ guid: entity.get(IdentifierFacet)?.props.guid || '' }));
  newGradeEntity.add(new ValueFacet({ value: updatedGrade.value }));
  newGradeEntity.add(new TypeFacet({ type: updatedGrade.type }));
  newGradeEntity.add(new ParentFacet({ parentId: updatedGrade.parentId }));
  newGradeEntity.add(new DateAddedFacet({ dateAdded: entity.get(DateAddedFacet)?.props.dateAdded || '' }));
  newGradeEntity.add(DataType.GRADE);

  lsc.engine.removeEntity(entity);
};

const EditGradeSheet = (props: EntityProps & ValueProps & TypeProps & DateAddedProps & ParentProps) => {
  const lsc = useContext(LeanScopeClientContext);
  const { entity } = props;
  const isVisible = useIsViewVisible(entity);
  const { updatedGrade, setUpdatedGrade, hasGradeChanged, canSaveChanges } = useUpdatedGrade(props);
  const schoolSubjectEntities = useSchoolSubjectEntities();
  const gradeTypes = useGradeTypes();
  const { selectedLanguage } = useSelectedLanguage();

  const navigateBack = () => entity.add(AdditionalTag.NAVIGATE_BACK);
  const openDeleteGradeAlert = () => lsc.stories.transitTo(Story.DELETING_GRADE_STORY);
  const handleUpdateGrade = () => {
    updateGrade(lsc, entity, updatedGrade);
    navigateBack();
  };

  const handleGradeValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = parseInt(e.target.value);
    if (newValue > 15) newValue = 15;
    if (newValue < 0) newValue = 0;
    if (isNaN(newValue)) newValue = 0;

    setUpdatedGrade({ ...updatedGrade, value: newValue });
  };

  return (
    <div>
      <Sheet navigateBack={navigateBack} visible={isVisible}>
        <FlexBox>
          <FlexBox>
            {hasGradeChanged ? (
              <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
            ) : (
              <div />
            )}
            {!hasGradeChanged ? (
              <PrimaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).done}</PrimaryButton>
            ) : (
              canSaveChanges && (
                <PrimaryButton onClick={handleUpdateGrade}>{displayButtonTexts(selectedLanguage).save}</PrimaryButton>
              )
            )}
          </FlexBox>
        </FlexBox>
        <Spacer />
        <Section>
          <SectionRow>
            <TextInput placeholder="Note" value={updatedGrade.value} onChange={handleGradeValueChange} />
          </SectionRow>
          <SectionRow>
            <FlexBox>
              <p>Notenart</p>
              <SelectInput
                value={updatedGrade.type}
                onChange={(e) => setUpdatedGrade({ ...updatedGrade, type: e.target.value })}
              >
                <option value="">{displayLabelTexts(selectedLanguage).select}</option>
                {gradeTypes.map((type, idx) => (
                  <option key={idx} value={type.id}>
                    {type.title}
                  </option>
                ))}
              </SelectInput>
            </FlexBox>
          </SectionRow>
          <SectionRow last>
            <FlexBox>
              <p>{displayLabelTexts(selectedLanguage).schoolSubject}</p>
              <SelectInput
                value={updatedGrade.parentId}
                onChange={(e) => setUpdatedGrade({ ...updatedGrade, parentId: e.target.value })}
              >
                <option value="">{displayLabelTexts(selectedLanguage).select}</option>
                {schoolSubjectEntities.map((entity, idx) => {
                  const schoolSubjectId = entity.get(IdentifierFacet)?.props.guid;
                  const schoolSubjectTitle = entity.get(TitleFacet)?.props.title;
                  return (
                    <option key={idx} value={schoolSubjectId}>
                      {schoolSubjectTitle}
                    </option>
                  );
                })}
              </SelectInput>
            </FlexBox>
          </SectionRow>
        </Section>
        <Spacer size={2} />
        <Section>
          <SectionRow onClick={openDeleteGradeAlert} last icon={<IoTrashOutline />} role="destructive">
            Löschen
          </SectionRow>
        </Section>
      </Sheet>

      <DeleteGradeAlert />
    </div>
  );
};

export default EditGradeSheet;

const useUpdatedGrade = (props: EntityProps & ValueProps & TypeProps & DateAddedProps & ParentProps) => {
  const { entity, value, type, dateAdded, parentId } = props;
  const [updatedGrade, setUpdatedGrade] = useState({ value, type, dateAdded, parentId });
  const [isVisible] = useEntityHasTags(entity, Tags.SELECTED);
  const hasGradeChanged =
    updatedGrade.value !== value ||
    updatedGrade.type !== type ||
    updatedGrade.dateAdded !== dateAdded ||
    updatedGrade.parentId !== parentId;
  const canSaveChanges = hasGradeChanged && updatedGrade.value !== undefined && updatedGrade.value >= 0;

  useEffect(() => {
    if (isVisible) {
      setUpdatedGrade({ value, type, dateAdded, parentId });
    }
  }, [isVisible]);

  return { updatedGrade, setUpdatedGrade, hasGradeChanged, canSaveChanges };
};

const deleteGrade = async (lsc: ILeanScopeClient, gradeEntity: Entity) => {
  const { error } = await supabaseClient
    .from(SupabaseTable.GRADES)
    .delete()
    .eq('id', gradeEntity.get(IdentifierFacet)?.props.guid);

  if (error) {
    console.error('Error deleting grade: ', error);
    addNotificationEntity(lsc, {
      title: 'Fehler beim Löschen deiner Note',
      message: error.message,
      type: 'error',
    });
    return;
  }

  lsc.engine.removeEntity(gradeEntity);
};

const DeleteGradeAlert = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.DELETING_GRADE_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedGradeEntity } = useSelectedGrade();

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_OVERVIEW);

  const handleDeleteGrade = async () => {
    deleteGrade(lsc, selectedGradeEntity);
    navigateBack();
  };

  return (
    <Alert navigateBack={navigateBack} visible={isVisible}>
      <AlertButton onClick={navigateBack} role="primary">
        {displayActionTexts(selectedLanguage).cancel}
      </AlertButton>
      <AlertButton onClick={handleDeleteGrade} role="destructive">
        {displayActionTexts(selectedLanguage).delete}
      </AlertButton>
    </Alert>
  );
};

const useSelectedGrade = () => {
  const [selectedGradeEntity] = useEntities((e) => e.has(Tags.SELECTED))[0];
  const selectedGradeId = selectedGradeEntity?.get(IdentifierFacet)?.props.guid;
  return { selectedGradeId, selectedGradeEntity };
};
