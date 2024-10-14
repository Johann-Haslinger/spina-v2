import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity } from '@leanscope/ecs-engine';
import { IdentifierFacet, ParentFacet, Tags, TextFacet } from '@leanscope/ecs-models';
import { useContext, useState } from 'react';
import tw from 'twin.macro';
import { v4 as uuid } from 'uuid';
import { DateAddedFacet, LearningUnitTypeFacet, PriorityFacet, TitleFacet } from '../../../../../app/additionalFacets';
import { DataType, LearningUnitPriority, LearningUnitType, Story } from '../../../../../base/enums';
import { GeneratedNoteResource } from '../../../../../base/types';
import { CloseButton, FlexBox, ScrollableBox } from '../../../../../components';
import SapientorConversationMessage from '../../../../../components/content/SapientorConversationMessage';
import { addLearningUnit } from '../../../../../functions/addLeaningUnit';
import { addText } from '../../../../../functions/addText';
import { useUserData } from '../../../../../hooks/useUserData';
import { useSelectedTopic } from '../../../hooks/useSelectedTopic';

const StyledNoteWrapper = styled.div`
  ${tw`md:px-4 pt-1 h-full w-full`}
`;

const GeneratedNote = (props: { note: GeneratedNoteResource; isVisible: boolean; regenerateNote: () => void }) => {
  const lsc = useContext(LeanScopeClientContext);
  const { note, isVisible, regenerateNote } = props;
  const { userId } = useUserData();
  const { selectedTopicId } = useSelectedTopic();
  const isNoteEmpty = note.text == '';
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  const navigateBack = () => lsc.stories.transitTo(Story.ANY);

  const saveLearningUnit = () => {
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

    const newTextEntity = new Entity();
    newTextEntity.add(new ParentFacet({ parentId: learningUnitId }));
    newTextEntity.add(new TextFacet({ text: note.text }));

    addText(lsc, newTextEntity, userId);
  };

  const checkParentId = () => {
    if (selectedTopicId) {
      saveLearningUnit();
    } else {
      const parentId = findMatchingTopicForLearningUnit(note.title + ' ' + note.text);
      setSelectedParentId(parentId);
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
