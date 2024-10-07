import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet } from '@leanscope/ecs-models';
import { useIsStoryCurrent } from '@leanscope/storyboarding';
import { useContext, useEffect, useRef, useState } from 'react';
import { IoAdd, IoCheckmarkCircle, IoEllipseOutline } from 'react-icons/io5';
import { v4 } from 'uuid';
import { DueDateFacet, RelationshipFacet, StatusFacet, TitleFacet } from '../../../base/additionalFacets';
import { DataType, Story } from '../../../base/enums';
import { useSchoolSubjectEntities } from '../../../common/hooks/useSchoolSubjects';
import { useSchoolSubjectTopics } from '../../../common/hooks/useSchoolSubjectTopics';
import { useSelectedLanguage } from '../../../common/hooks/useSelectedLanguage';
import { useUserData } from '../../../common/hooks/useUserData';
import { addExam } from '../../../common/utilities/addExam';
import { addTopic } from '../../../common/utilities/addTopic';
import { displayActionTexts, displayButtonTexts, displayLabelTexts } from '../../../common/utilities/displayText';
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
  TextInput,
} from '../../../components';
import { generateDescriptionForTopic } from '../../collection/functions/generateDescriptionForTopic';

const AddExamSheet = () => {
  const lsc = useContext(LeanScopeClientContext);
  const isVisible = useIsStoryCurrent(Story.ADDING_EXAM_STORY);
  const { selectedLanguage } = useSelectedLanguage();
  const schooolSubjectEntities = useSchoolSubjectEntities();
  const [selectedSchoolSubjectId, setSelectedSchoolSubjectId] = useState<string>('');
  const { schoolSubjectTopics } = useSchoolSubjectTopics(selectedSchoolSubjectId);
  const { userId } = useUserData();
  const [newExam, setNewExam] = useState({
    id: v4(),
    title: '',
    dueDate: '',
    parent: '',
  });
  const [isAddingNewTopic, setIsAddingNewTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const examTitleInputRef = useRef<HTMLInputElement>(null);
  const topicTitleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isVisible) setTimeout(() => examTitleInputRef.current?.focus(), 10);
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) {
      setNewExam({ title: '', parent: '', dueDate: '', id: v4() });
    }
  }, [isVisible]);

  const navigateBack = () => lsc.stories.transitTo(Story.OBSERVING_EXAMS_STORY);

  const saveExam = async () => {
    const { title, dueDate, parent, id } = newExam;
    const newExamEntity = new Entity();
    lsc.engine.addEntity(newExamEntity);
    newExamEntity.add(new IdentifierFacet({ guid: id }));
    newExamEntity.add(
      new ParentFacet({
        parentId: parent,
      }),
    );
    newExamEntity.add(new TitleFacet({ title: title }));
    newExamEntity.add(new DueDateFacet({ dueDate: dueDate }));

    newExamEntity.add(
      new RelationshipFacet({
        relationship: selectedSchoolSubjectId,
      }),
    );
    newExamEntity.add(new StatusFacet({ status: 1 }));
    newExamEntity.add(DataType.EXAM);

    if (newTopicTitle !== '') {
      const newTopicId = v4();
      const newTopicEntity = new Entity();
      lsc.engine.addEntity(newTopicEntity);
      newTopicEntity.add(new IdentifierFacet({ guid: newTopicId }));
      newTopicEntity.add(new TitleFacet({ title: newTopicTitle }));
      newTopicEntity.add(new ParentFacet({ parentId: selectedSchoolSubjectId }));
      newTopicEntity.add(DataType.TOPIC);

      addTopic(lsc, newTopicEntity, userId);

      newExamEntity.add(new ParentFacet({ parentId: newTopicId }));

      await generateDescriptionForTopic(newTopicEntity);
    }

    addExam(lsc, newExamEntity, userId);

    navigateBack();
  };

  return (
    <Sheet navigateBack={navigateBack} visible={isVisible}>
      <FlexBox>
        <SecondaryButton onClick={navigateBack}>{displayButtonTexts(selectedLanguage).cancel}</SecondaryButton>
        {newExam.title && newExam.parent && (
          <PrimaryButton onClick={saveExam}>{displayButtonTexts(selectedLanguage).save}</PrimaryButton>
        )}
      </FlexBox>
      <Spacer />
      <Section>
        <SectionRow>
          <TextInput
            ref={examTitleInputRef}
            placeholder={displayLabelTexts(selectedLanguage).title}
            value={newExam.title}
            onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
          />
        </SectionRow>
        <SectionRow>
          <FlexBox>
            <p>{displayLabelTexts(selectedLanguage).dueDate} </p>
            <DateInput
              value={newExam.dueDate}
              onChange={(e) => setNewExam({ ...newExam, dueDate: e.target.value })}
              type="date"
            />
          </FlexBox>
        </SectionRow>
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
      </Section>
      <Spacer size={2} />
      {selectedSchoolSubjectId && (
        <Section>
          {schoolSubjectTopics.map((topic, idx) => (
            <SectionRow
              key={idx}
              onClick={() => setNewExam({ ...newExam, parent: topic.id })}
              icon={newExam.parent === topic.id ? <IoCheckmarkCircle /> : <IoEllipseOutline />}
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
                  newExam.parent === 'newTopic' ? (
                    <IoCheckmarkCircle />
                  ) : (
                    <IoEllipseOutline onClick={() => setNewExam({ ...newExam, parent: 'newTopic' })} />
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
      )}
    </Sheet>
  );
};

export default AddExamSheet;
