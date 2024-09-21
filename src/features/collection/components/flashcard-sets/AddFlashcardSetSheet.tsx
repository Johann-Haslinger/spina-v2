import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { Fragment, useContext, useState } from 'react';
import { IoCheckmarkCircle, IoEllipseOutline } from 'react-icons/io5';
import { v4 } from 'uuid';
import { DateAddedFacet, LearningUnitTypeFacet, TitleFacet } from '../../../../app/additionalFacets';
import { DataType, LearningUnitType, Story } from '../../../../base/enums';
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
import { addLearningUnit } from '../../../../functions/addLeaningUnit';
import { useSchoolSubjectEntities } from '../../../../hooks/useSchoolSubjects';
import { useSchoolSubjectTopics } from '../../../../hooks/useSchoolSubjectTopics';
import { useSelectedLanguage } from '../../../../hooks/useSelectedLanguage';
import { useUserData } from '../../../../hooks/useUserData';
import { displayAlertTexts, displayButtonTexts, displayLabelTexts } from '../../../../utils/displayText';
import { useSelectedTopic } from '../../hooks/useSelectedTopic';

const AddFlashcardSetSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.ADDING_FLASHCARD_SET_STORY);
  const [selectedSchoolSubjectId, setSelectedSchoolSubjectId] = useState<string>('');
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedTopicId } = useSelectedTopic();
  const schooolSubjectEntities = useSchoolSubjectEntities();
  const inCollectionVisible = location.pathname.includes('/collection');
  const { schoolSubjectTopics, hasSchoolSubjectTopics } = useSchoolSubjectTopics(selectedSchoolSubjectId);
  const [newFlashcardSet, setNewFlashcardSet] = useState({
    title: '',
    parent: '',
  });
  const { userId } = useUserData();

  const saveFlashcardSet = async () => {
    navigateBack();
    const flashcardSetId = v4();
    const parentId = inCollectionVisible ? selectedTopicId || '' : newFlashcardSet.parent;

    const newFlashcardSetEntity = new Entity();
    newFlashcardSetEntity.add(new IdentifierFacet({ guid: flashcardSetId }));
    newFlashcardSetEntity.add(new TitleFacet({ title: newFlashcardSet.title }));
    newFlashcardSetEntity.add(new DateAddedFacet({ dateAdded: new Date().toISOString() }));
    newFlashcardSetEntity.add(new ParentFacet({ parentId: parentId }));
    newFlashcardSetEntity.add(new LearningUnitTypeFacet({ type: LearningUnitType.FLASHCARD_SET }));
    newFlashcardSetEntity.addTag(DataType.LEARNING_UNIT);

    addLearningUnit(lsc, newFlashcardSetEntity, userId);
  };

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_TOPIC_STORY);

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <FlexBox>
        <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
        {newFlashcardSet.title && (inCollectionVisible || newFlashcardSet.parent) && (
          <PrimaryButton onClick={saveFlashcardSet}>{displayButtonTexts(selectedLanguage).save}</PrimaryButton>
        )}
      </FlexBox>
      <Spacer />
      <Section>
        <SectionRow last={inCollectionVisible}>
          <TextInput
            value={newFlashcardSet.title}
            onChange={(e) => setNewFlashcardSet({ ...newFlashcardSet, title: e.target.value })}
            placeholder={displayLabelTexts(selectedLanguage).title}
          />
        </SectionRow>
        {!inCollectionVisible && (
          <SectionRow last>
            <FlexBox>
              <p>{displayLabelTexts(selectedLanguage).schoolSubject}</p>
              <SelectInput value={selectedSchoolSubjectId} onChange={(e) => setSelectedSchoolSubjectId(e.target.value)}>
                <option value="">{displayLabelTexts(selectedLanguage).select}</option>
                {schooolSubjectEntities.map((entity, idx) => {
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
        )}
      </Section>

      {(hasSchoolSubjectTopics || selectedSchoolSubjectId) && (
        <Fragment>
          <Spacer size={2} />
          <Section>
            {schoolSubjectTopics.map((topic, idx) => (
              <SectionRow
                last={idx === schoolSubjectTopics.length - 1}
                key={idx}
                onClick={() => setNewFlashcardSet({ ...newFlashcardSet, parent: topic.id })}
                icon={newFlashcardSet.parent === topic.id ? <IoCheckmarkCircle /> : <IoEllipseOutline />}
              >
                {topic.title}
              </SectionRow>
            ))}
            {!hasSchoolSubjectTopics && <SectionRow last>{displayAlertTexts(selectedLanguage).noTopics}</SectionRow>}
          </Section>
        </Fragment>
      )}
    </Sheet>
  );
};

export default AddFlashcardSetSheet;
