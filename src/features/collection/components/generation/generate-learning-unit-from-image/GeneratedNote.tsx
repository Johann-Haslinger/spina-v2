import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet, Tags, TextFacet } from '@leanscope/ecs-models';
import { useContext, useEffect } from 'react';
import tw from 'twin.macro';
import { v4 as uuid } from 'uuid';
import { useUserData } from '../../../../../common/hooks/useUserData';
import {
  DateAddedFacet,
  LearningUnitTypeFacet,
  PriorityFacet,
  TitleFacet,
} from '../../../../../common/types/additionalFacets';
import { DataType, LearningUnitPriority, LearningUnitType, Story } from '../../../../../common/types/enums';
import { GeneratedNoteResource } from '../../../../../common/types/types';
import { addLearningUnit } from '../../../../../common/utilities/addLeaningUnit';
import { addText } from '../../../../../common/utilities/addText';
import { CloseButton, FlexBox, ScrollableBox } from '../../../../../components';
import SapientorConversationMessage from '../../../../../components/content/SapientorConversationMessage';
import { useSelectedTopic } from '../../../hooks/useSelectedTopic';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const StyledNoteWrapper = styled.div`
  ${tw`md:px-4 pt-1 h-full w-full`}
`;

const GeneratedNote = (props: {
  note: GeneratedNoteResource;
  isVisible: boolean;
  regenerateNote: () => void;
  selectedParentId: string | null;
}) => {
  const lsc = useContext(LeanScopeClientContext);
  const { note, isVisible, regenerateNote, selectedParentId } = props;
  const { userId } = useUserData();
  const { selectedTopicId } = useSelectedTopic();
  const isNoteEmpty = note.text == '';

  const navigateBack = () => lsc.stories.transitTo(Story.ANY);

  useEffect(() => {
    if (selectedParentId && !isNoteEmpty) {
      saveLearningUnit(selectedParentId);
    }
  }, [selectedParentId]);

  const saveLearningUnit = async (selectedParentId: string) => {
    navigateBack();

    const parentId = selectedTopicId || selectedParentId;
    const learningUnitId = uuid();

    const newLearningUnitEntity = new Entity();
    newLearningUnitEntity.add(new IdentifierFacet({ guid: learningUnitId }));
    newLearningUnitEntity.add(new TitleFacet({ title: note.title }));
    newLearningUnitEntity.add(new LearningUnitTypeFacet({ type: LearningUnitType.NOTE }));
    newLearningUnitEntity.add(new ParentFacet({ parentId: parentId || '' }));
    newLearningUnitEntity.add(new DateAddedFacet({ dateAdded: new Date().toISOString() }));
    newLearningUnitEntity.add(new PriorityFacet({ priority: LearningUnitPriority.PAUSED }));
    newLearningUnitEntity.add(DataType.LEARNING_UNIT);
    newLearningUnitEntity.add(Tags.SELECTED);

    addLearningUnit(lsc, newLearningUnitEntity, userId);

    await delay(300);
    console.log('newLearningUnitEntity', newLearningUnitEntity, learningUnitId);
    const newTextEntity = new Entity();
    newTextEntity.add(new ParentFacet({ parentId: learningUnitId }));
    newTextEntity.add(new TextFacet({ text: note.text }));

    addText(lsc, newTextEntity, userId);
  };

  const checkParentId = () => {
    if (selectedTopicId) {
      saveLearningUnit(selectedTopicId);
    } else {
      lsc.stories.transitTo(Story.SELECTING_PARENT_STORY);
    }
  };

  return (
    <StyledNoteWrapper>
      <FlexBox>
        <div />
        <CloseButton onClick={navigateBack} />
      </FlexBox>

      <ScrollableBox>
        {isVisible && (
          <SapientorConversationMessage
            message={{
              role: 'gpt',
              message: isNoteEmpty
                ? 'Leider konnte aus deinem Bild keine Notiz generiert werden. Bitte versuche es mit einem anderen Bild erneut.'
                : 'Passt das so für dich? <br/><br/>' + note.text + '<br/><br/>',
              suggestions: !isNoteEmpty
                ? [
                    {
                      answer: 'Ja, das passt!',
                      func: checkParentId,
                    },
                    {
                      answer: 'Nein, kannst du das nochmal generieren?',
                      func: regenerateNote,
                    },
                  ]
                : [],
            }}
          />
        )}
      </ScrollableBox>
    </StyledNoteWrapper>
  );
};

export default GeneratedNote;
