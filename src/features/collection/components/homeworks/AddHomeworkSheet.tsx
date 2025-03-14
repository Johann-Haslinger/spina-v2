import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { DescriptionFacet, IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { IoAdd, IoCheckmarkCircle, IoEllipseOutline } from 'react-icons/io5';
import { useLocation } from 'react-router';
import { v4 } from 'uuid';
import { useSchoolSubjectEntities } from '../../../../common/hooks/useSchoolSubjects';
import { useSchoolSubjectTopics } from '../../../../common/hooks/useSchoolSubjectTopics';
import { useSelectedLanguage } from '../../../../common/hooks/useSelectedLanguage';
import { useUserData } from '../../../../common/hooks/useUserData';
import { DueDateFacet, RelationshipFacet, StatusFacet, TitleFacet } from '../../../../common/types/additionalFacets';
import { DataType, Story } from '../../../../common/types/enums';
import { addHomework } from '../../../../common/utilities/addHomework';
import { addTopic } from '../../../../common/utilities/addTopic';
import { displayActionTexts, displayButtonTexts, displayLabelTexts } from '../../../../common/utilities/displayText';
import {
  DateInput,
  FlexBox,
  PrimaryButton,
  SecondaryButton,
  Section,
  SectionRow,
  SelectInput,
  Sheet,
  Spacer,
  TextAreaInput,
  TextInput,
} from '../../../../components';
import { generateDescriptionForTopic } from '../../functions/generateDescriptionForTopic';
import { useDiscardAlertState } from '../../hooks/useDiscardAlertState';
import { useSelectedSchoolSubject } from '../../hooks/useSelectedSchoolSubject';
import { useSelectedTopic } from '../../hooks/useSelectedTopic';
import { DiscardUnsavedChangesAlert } from '../../../../common/components/others';

const AddHomeworkSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.ADDING_HOMEWORK_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const schoolSubjectEntities = useSchoolSubjectEntities();
  const { selectedTopicId: openTopicId } = useSelectedTopic();
  const { selectedSchoolSubjectId: openSchoolSubjectId } = useSelectedSchoolSubject();
  const [selectedSchoolSubjectId, setSelectedSchoolSubjectId] = useState<string>('');
  const [newHomework, setNewHomework] = useState({
    id: v4(),
    title: '',
    dueDate: '',
    parent: '',
    description: '',
    relatedSchoolSubject: '',
  });
  const { userId } = useUserData();
  const { schoolSubjectTopics, setSchoolSubjectTopics } = useSchoolSubjectTopics(selectedSchoolSubjectId);
  const location = useLocation();
  const inCollectionVisible = location.pathname.includes('/collection');
  const [isAddingNewTopic, setIsAddingNewTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const homeworkTitleInputRef = useRef<HTMLInputElement>(null);
  const topicTitleInputRef = useRef<HTMLInputElement>(null);
  const { isDiscardAlertVisible, openDiscardAlert, closeDiscardAlert } = useDiscardAlertState();
  const hasUnsavedChanges = newHomework.title || newHomework.dueDate || selectedSchoolSubjectId;

  useEffect(() => {
    if (isVisible) setTimeout(() => homeworkTitleInputRef.current?.focus(), 10);
  }, [isVisible]);

  useEffect(() => {
    setNewHomework({
      id: v4(),
      title: '',
      dueDate: '',
      parent: '',
      description: '',
      relatedSchoolSubject: '',
    });
    setSelectedSchoolSubjectId('');
    setSchoolSubjectTopics([]);
    setNewTopicTitle('');
  }, [isVisible]);

  const navigateBack = () => {
    closeDiscardAlert();
    lsc.stories.transitTo(Story.OBSERVING_SCHOOL_SUBJECT_STORY);
  };

  const saveHomework = async () => {
    const newHomeworkId = v4();
    const newTopicId = v4();

    const { title, dueDate, parent, description } = newHomework;
    const newHomeworkEntity = new Entity();
    newHomeworkEntity.add(new IdentifierFacet({ guid: newHomeworkId }));
    newHomeworkEntity.add(
      new ParentFacet({
        parentId: openTopicId || parent == 'newTopic' ? newTopicId : parent,
      }),
    );
    newHomeworkEntity.add(new TitleFacet({ title: title }));
    newHomeworkEntity.add(new DueDateFacet({ dueDate: dueDate }));
    newHomeworkEntity.add(
      new DescriptionFacet({
        description: description,
      }),
    );
    newHomeworkEntity.add(
      new RelationshipFacet({
        relationship: openSchoolSubjectId || selectedSchoolSubjectId,
      }),
    );
    newHomeworkEntity.add(new StatusFacet({ status: 1 }));
    newHomeworkEntity.add(DataType.HOMEWORK);

    addHomework(lsc, newHomeworkEntity, userId);

    navigateBack();

    if (newTopicTitle !== '') {
      const newTopicEntity = new Entity();
      newTopicEntity.add(new IdentifierFacet({ guid: newTopicId }));
      newTopicEntity.add(new TitleFacet({ title: newTopicTitle }));
      newTopicEntity.add(new ParentFacet({ parentId: selectedSchoolSubjectId }));
      newTopicEntity.add(DataType.TOPIC);
      addTopic(lsc, newTopicEntity, userId);

      await generateDescriptionForTopic(lsc, newTopicEntity);
    }
  };

  const handleBackClick = () => (hasUnsavedChanges ? openDiscardAlert() : navigateBack());

  return (
    <div>
      <Sheet visible={isVisible} navigateBack={handleBackClick}>
        <FlexBox>
          <SecondaryButton onClick={handleBackClick}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>

          {newHomework.title && newHomework.dueDate && schoolSubjectEntities.length !== 0 && (
            <PrimaryButton onClick={saveHomework}>{displayButtonTexts(selectedLanguage).save}</PrimaryButton>
          )}
        </FlexBox>
        <Spacer />
        <Section>
          <SectionRow>
            <TextInput
              ref={homeworkTitleInputRef}
              value={newHomework.title}
              onChange={(e) => setNewHomework({ ...newHomework, title: e.target.value })}
              placeholder={displayLabelTexts(selectedLanguage).title}
            />
          </SectionRow>
          <SectionRow last={inCollectionVisible}>
            <FlexBox>
              <p>{displayLabelTexts(selectedLanguage).dueDate} </p>
              <DateInput
                value={newHomework.dueDate}
                onChange={(e) => setNewHomework({ ...newHomework, dueDate: e.target.value })}
                type="date"
              />
            </FlexBox>
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
        {selectedSchoolSubjectId && (
          <Fragment>
            <Spacer size={2} />
            <Section>
              {schoolSubjectTopics.map((topic, idx) => (
                <SectionRow
                  key={idx}
                  onClick={() => setNewHomework({ ...newHomework, parent: topic.id })}
                  icon={newHomework.parent === topic.id ? <IoCheckmarkCircle /> : <IoEllipseOutline />}
                >
                  {topic.title}
                </SectionRow>
              ))}
              {!isAddingNewTopic ? (
                <SectionRow
                  icon={<IoAdd />}
                  last
                  role="button"
                  onClick={() => {
                    setIsAddingNewTopic(true);
                    setTimeout(() => topicTitleInputRef.current?.focus(), 10);
                  }}
                >
                  {displayActionTexts(selectedLanguage).addTopic}
                </SectionRow>
              ) : (
                <SectionRow
                  last
                  icon={
                    newTopicTitle !== '' ? (
                      newHomework.parent === 'newTopic' ? (
                        <IoCheckmarkCircle />
                      ) : (
                        <IoEllipseOutline onClick={() => setNewHomework({ ...newHomework, parent: 'newTopic' })} />
                      )
                    ) : (
                      <IoEllipseOutline style={{ color: '#86858A' }} />
                    )
                  }
                >
                  <TextInput
                    ref={topicTitleInputRef}
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                  />
                </SectionRow>
              )}
            </Section>
          </Fragment>
        )}

        <Spacer size={2} />
        <Section>
          <SectionRow last>
            <TextAreaInput
              value={newHomework.description}
              onChange={(e) => setNewHomework({ ...newHomework, description: e.target.value })}
              placeholder={displayLabelTexts(selectedLanguage).description}
            />
          </SectionRow>
        </Section>
      </Sheet>

      <DiscardUnsavedChangesAlert isVisible={isDiscardAlertVisible} cancel={closeDiscardAlert} close={navigateBack} />
    </div>
  );
};

export default AddHomeworkSheet;
