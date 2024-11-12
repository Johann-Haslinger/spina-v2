import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useGradeTypes, useInputFocus } from '../../../../common/hooks';
import { useSchoolSubjectEntities } from '../../../../common/hooks/useSchoolSubjects';
import { useSelectedLanguage } from '../../../../common/hooks/useSelectedLanguage';
import { useUserData } from '../../../../common/hooks/useUserData';
import { TitleFacet, TypeFacet, ValueFacet } from '../../../../common/types/additionalFacets';
import { DataType, Story } from '../../../../common/types/enums';
import { addGrade } from '../../../../common/utilities/addGrade';
import { displayButtonTexts, displayLabelTexts } from '../../../../common/utilities/displayText';
import {
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

const AddGradeSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.AddING_GRADE_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const { grade, setGrade } = useNewGrade();
  const isGradeValid = grade.type_id && grade.parent_id && grade.value;
  const gradeInputRef = useRef<HTMLInputElement>(null);
  const schoolSubjectEntities = useSchoolSubjectEntities();
  const gradeTypes = useGradeTypes();
  const { userId } = useUserData();

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_OVERVIEW);

  useInputFocus(gradeInputRef, isVisible);

  const handleAddGrade = async () => {
    const newGradeEntity = new Entity();
    newGradeEntity.add(new IdentifierFacet({ guid: uuid() }));
    newGradeEntity.add(new ParentFacet({ parentId: grade.parent_id }));
    newGradeEntity.add(new ValueFacet({ value: grade.value || 0 }));
    newGradeEntity.add(new TypeFacet({ type: grade.type_id }));
    newGradeEntity.add(DataType.GRADE);

    addGrade(lsc, newGradeEntity, userId);
    navigateBack();
  };

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <SecondaryButton>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
        {isGradeValid && (
          <PrimaryButton onClick={handleAddGrade}>{displayButtonTexts(selectedLanguage).save}</PrimaryButton>
        )}
      </FlexBox>
      <Spacer size={4} />
      <Section>
        <SectionRow>
          <TextInput
            ref={gradeInputRef}
            placeholder="Note"
            type="number"
            min={0}
            max={15}
            value={grade.value}
            onChange={(e) => setGrade({ ...grade, value: Number(e.target.value) })}
          />
        </SectionRow>
        <SectionRow>
          <FlexBox>
            <p>Notenart</p>
            <SelectInput value={grade.type_id} onChange={(e) => setGrade({ ...grade, type_id: e.target.value })}>
              <option value="">{displayLabelTexts(selectedLanguage).select}</option>
              {gradeTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.title}
                </option>
              ))}
            </SelectInput>
          </FlexBox>
        </SectionRow>
        <SectionRow last>
          <FlexBox>
            <p>{displayLabelTexts(selectedLanguage).schoolSubject}</p>
            <SelectInput value={grade.parent_id} onChange={(e) => setGrade({ ...grade, parent_id: e.target.value })}>
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
    </Sheet>
  );
};

export default AddGradeSheet;

const useNewGrade = () => {
  const isVisible = useIsStoryCurrent(Story.AddING_GRADE_STORY);
  const [grade, setGrade] = useState<{
    type_id: string;
    parent_id: string;
    value: number | undefined;
  }>({
    type_id: '',
    parent_id: '',
    value: undefined,
  });

  useEffect(() => {
    if (isVisible) {
      setGrade({
        type_id: '',
        parent_id: '',
        value: undefined,
      });
    }
  }, [isVisible]);

  return { grade, setGrade };
};
