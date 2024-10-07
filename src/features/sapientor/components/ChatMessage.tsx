import styled from '@emotion/styled';
import { LeanScopeClientContext } from '@leanscope/api-client/browser';
import { Entity, EntityProps, EntityPropsMapper } from '@leanscope/ecs-engine';
import { IdentifierFacet, Tags, TextProps } from '@leanscope/ecs-models';
import { motion } from 'framer-motion';
import { useContext, useEffect } from 'react';
import { Fragment } from 'react/jsx-runtime';
import tw from 'twin.macro';
import { MessageRoleProps, RelatedResourcesProps, TitleFacet, TitleProps } from '../../../base/additionalFacets';
import { COLOR_ITEMS } from '../../../base/constants';
import { AdditionalTag, DataType, MessageRole } from '../../../base/enums';
import { Resource } from '../../../base/types';
import { useSelectedLanguage } from '../../../common/hooks/useSelectedLanguage';
import { displayDataTypeTexts } from '../../../common/utilities/displayText';
import { NoteThumbNail, TopicResoucreThumbNail } from '../../../components';
import SapientorConversationMessage from '../../../components/content/SapientorConversationMessage';
import { useAppState } from '../../collection/hooks/useAppState';

const TopicResourceCell = (props: TitleProps & EntityProps) => {
  const { title, entity } = props;
  const { appStateEntity } = useAppState();

  const openTopic = () => {
    entity.addTag(Tags.SELECTED);
    appStateEntity?.remove(AdditionalTag.CONVERSATION_VISIBLE);
  };

  return <TopicResoucreThumbNail onClick={openTopic} color={COLOR_ITEMS[1].color} title={title} />;
};

const StyledNoteResouceCellWrapper = styled.div`
  ${tw`h-fit w-36`}
`;
const NoteResouceCell = (props: TitleProps & EntityProps) => {
  const { title, entity } = props;

  const openNote = () => entity.addTag(Tags.SELECTED);

  return (
    <StyledNoteResouceCellWrapper>
      <NoteThumbNail color={COLOR_ITEMS[1].color} onClick={openNote} title={title} />
    </StyledNoteResouceCellWrapper>
  );
};

const HomeworkResourceCell = (props: TitleProps & EntityProps) => {
  const { title, entity } = props;
  const { selectedLanguage } = useSelectedLanguage();

  const openHomework = () => entity.addTag(Tags.SELECTED);

  return (
    <StyledNoteResouceCellWrapper>
      <NoteThumbNail
        onClick={openHomework}
        color={COLOR_ITEMS[1].color}
        title={title}
        type={displayDataTypeTexts(selectedLanguage).homework}
      />
    </StyledNoteResouceCellWrapper>
  );
};

const InitializeRelatedResourcesSystem = (props: { relatedResources: Resource[] }) => {
  const lsc = useContext(LeanScopeClientContext);
  const { relatedResources } = props;

  useEffect(() => {
    relatedResources.forEach((r) => {
      const isExisting = lsc.engine.entities.some(
        (e) => e.has(IdentifierFacet) && e.get(IdentifierFacet)?.props.guid === r.id,
      );

      if (!isExisting) {
        const newResoucreEntity = new Entity();
        lsc.engine.addEntity(newResoucreEntity);
        newResoucreEntity.add(new IdentifierFacet({ guid: r.id }));
        newResoucreEntity.add(new TitleFacet({ title: r.title }));
        newResoucreEntity.add(r.resourceType as DataType);
        newResoucreEntity.add(AdditionalTag.RELATED_THREAD_RESOURCE);
      }
    });
  }, [lsc.engine, relatedResources, relatedResources.length]);

  return null;
};

const StyledRelatedResourcesWrapper = styled.div`
  ${tw`border-t dark:border-opacity-50 border-opacity-50 flex w-[95%] mx-8 overflow-x-scroll dark:border-primary-border-dark border-primary-border mt-6 pt-4 `}
`;

const StyledContainer = styled.div`
  ${tw`flex w-full`}
`;

const RelatedResourcesInfo = (props: { relatedResources: Resource[] }) => {
  const { relatedResources } = props;

  return (
    <Fragment>
      <InitializeRelatedResourcesSystem relatedResources={relatedResources} />

      <StyledRelatedResourcesWrapper>
        <StyledContainer>
          <EntityPropsMapper
            query={(e) =>
              e.has(DataType.TOPIC) && relatedResources.some((r) => r.id === e.get(IdentifierFacet)?.props.guid)
            }
            get={[[TitleFacet], []]}
            onMatch={TopicResourceCell}
          />
          <EntityPropsMapper
            query={(e) =>
              e.has(DataType.NOTE) && relatedResources.some((r) => r.id === e.get(IdentifierFacet)?.props.guid)
            }
            get={[[TitleFacet], []]}
            onMatch={NoteResouceCell}
          />
          <EntityPropsMapper
            query={(e) =>
              e.has(DataType.HOMEWORK) && relatedResources.some((r) => r.id === e.get(IdentifierFacet)?.props.guid)
            }
            get={[[TitleFacet], []]}
            onMatch={HomeworkResourceCell}
          />
        </StyledContainer>
      </StyledRelatedResourcesWrapper>
    </Fragment>
  );
};

const ChatMessage = (props: TextProps & MessageRoleProps & RelatedResourcesProps) => {
  const { text, role, relatedResources = [] } = props;

  return (
    <div>
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
      >
        <SapientorConversationMessage
          playWritingAnimation={false}
          message={{
            role: role == MessageRole.USER ? 'user' : 'gpt',
            message: text,
            specialContent: relatedResources.length > 0 && <RelatedResourcesInfo relatedResources={relatedResources} />,
          }}
        />
      </motion.div>
    </div>
  );
};

export default ChatMessage;
