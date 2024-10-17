import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet, Tags } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { IoCheckmarkCircle, IoEllipseOutline } from 'react-icons/io5';
import { v4 } from 'uuid';
import { useInputFocus } from '../../../../common/hooks';
import { useSchoolSubjectEntities } from '../../../../common/hooks/useSchoolSubjects';
import { useSchoolSubjectTopics } from '../../../../common/hooks/useSchoolSubjectTopics';
import { useSelectedLanguage } from '../../../../common/hooks/useSelectedLanguage';
import { useUserData } from '../../../../common/hooks/useUserData';
import { DateAddedFacet, LearningUnitTypeFacet, TitleFacet } from '../../../../common/types/additionalFacets';
import { DataType, LearningUnitType, Story } from '../../../../common/types/enums';
import { addLearningUnit } from '../../../../common/utilities/addLeaningUnit';
import { displayAlertTexts, displayButtonTexts, displayLabelTexts } from '../../../../common/utilities/displayText';
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
import { useDiscardAlertState } from '../../hooks/useDiscardAlertState';
import { useSelectedTopic } from '../../hooks/useSelectedTopic';
import { DiscardUnsavedChangesAlert } from '../../../../common/components/others';

const AddFlashcardSetSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.ADDING_FLASHCARD_SET_STORY);
  const [selectedSchoolSubjectId, setSelectedSchoolSubjectId] = useState<string>('');
  const { selectedLanguage } = useSelectedLanguage();
  const { selectedTopicId } = useSelectedTopic();
  const schoolSubjectEntities = useSchoolSubjectEntities();
  const inCollectionVisible = location.pathname.includes('/collection');
  const { schoolSubjectTopics, hasSchoolSubjectTopics } = useSchoolSubjectTopics(selectedSchoolSubjectId);
  const [newFlashcardSet, setNewFlashcardSet] = useState({
    title: '',
    parent: '',
  });
  const { userId } = useUserData();
  const inputRef = useRef<HTMLInputElement>(null);
  const { isDiscardAlertVisible, openDiscardAlert, closeDiscardAlert } = useDiscardAlertState();
  const hasUnsavedChanges = newFlashcardSet.title;

  useInputFocus(inputRef, isVisible);

  useEffect(() => {
    if (isVisible) {
      setNewFlashcardSet({ title: '', parent: '' });
    }
  }, [isVisible]);

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

    setTimeout(() => {
      newFlashcardSetEntity.add(Tags.SELECTED);
    }, 500);
    setTimeout(() => {
      lsc.stories.transitTo(Story.ADDING_FLASHCARDS_STORY);
    }, 1000);
  };

  const navigateBack = () => {
    closeDiscardAlert();
    lsc.stories.transitTo(Story.OBSERVING_TOPIC_STORY);
  };

  const handleBackClick = () => (hasUnsavedChanges ? openDiscardAlert() : navigateBack());

  return (
    <div>
      <Sheet visible={isVisible} navigateBack={handleBackClick}>
        <FlexBox>
          <SecondaryButton onClick={handleBackClick}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
          {newFlashcardSet.title && (inCollectionVisible || newFlashcardSet.parent) && (
            <PrimaryButton onClick={saveFlashcardSet}>{displayButtonTexts(selectedLanguage).save}</PrimaryButton>
          )}
        </FlexBox>
        <Spacer />
        <Section>
          <SectionRow last={inCollectionVisible}>
            <TextInput
              ref={inputRef}
              value={newFlashcardSet.title}
              onChange={(e) => setNewFlashcardSet({ ...newFlashcardSet, title: e.target.value })}
              placeholder={displayLabelTexts(selectedLanguage).title}
            />
          </SectionRow>
          {!inCollectionVisible && (
            <SectionRow last>
              <FlexBox>
                <p>{displayLabelTexts(selectedLanguage).schoolSubject}</p>
                <SelectInput
                  value={selectedSchoolSubjectId}
                  onChange={(e) => setSelectedSchoolSubjectId(e.target.value)}
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

      <DiscardUnsavedChangesAlert isVisible={isDiscardAlertVisible} cancel={closeDiscardAlert} close={navigateBack} />
    </div>
  );
};

export default AddFlashcardSetSheet;
