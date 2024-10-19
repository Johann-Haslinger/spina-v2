import styled from '@emotion/styled';
import { EntityPropsMapper, useEntities } from '@leanscope/ecs-engine';
import { TextFacet } from '@leanscope/ecs-models';
import { IoBulb, IoClose, IoFlash } from 'react-icons/io5';
import tw from 'twin.macro';

import { useEntityHasTags } from '@leanscope/ecs-engine';
import { useEffect, useState } from 'react';
import { MessageRoleFacet, RelatedResourcesFacet } from '../../../common/types/additionalFacets';
import { COLOR_ITEMS } from '../../../common/types/constants';
import { AdditionalTag, SupportedModel } from '../../../common/types/enums';
import { sortMessageEntitiesByDateAdded } from '../../../common/utilities/sortEntitiesByTime';
import { ScrollableBox, Sheet, Spacer } from '../../../components';
import SapientorConversationMessage from '../../../components/content/SapientorConversationMessage';
import { useCurrentSapientorConversation } from '../hooks/useCurrentConversation';
import ChatMessage from './ChatMessage';
import SapientorPromptBox from './SapientorPromptBox';

const useDisplayLoadingAnimation = () => {
  const [promptEntity] = useEntities((e) => e.has(AdditionalTag.PROMPT) && e.has(AdditionalTag.PROCESSING))[0];
  const [isProcessingCurrentPrompt] = useEntityHasTags(promptEntity, AdditionalTag.PROCESSING);
  const [displayLoadingAnimation, setDisplayLoadingAnimation] = useState(false);

  useEffect(() => {
    if (isProcessingCurrentPrompt) {
      setTimeout(() => {
        setDisplayLoadingAnimation(true);
      }, 200);
    } else {
      setDisplayLoadingAnimation(false);
    }
  }, [isProcessingCurrentPrompt]);

  return displayLoadingAnimation;
};

const StyledCloseButtonWrapper = styled.div`
  ${tw`p-1 mr-2 transition-all md:hover:opacity-50 relative left-2 dark:bg-tertiary-dark dark:text-secondary-text-dark bg-tertiary rounded-full text-lg text-secondary-text-dark`}
`;
const StyledPromptTextBoxWrapper = styled.div`
  ${tw`absolute h-fit w-[90%] md:w-[40%] overflow-hidden pl-12   md:ml-[10%] bottom-2 md:bottom-12 lg:bottom-12 `}
`;

const StyledContentWrapper = styled.div`
  ${tw`  overflow-x-hidden pt-2 w-full overflow-y-scroll h-[90%] `}
`;
const StyledSegmentedControlWrapper = styled.div`
  ${tw` flex rounded-full p-0.5 bg-tertiary dark:bg-tertiary-dark w-56  h-10`}
`;

const StyledSegmentedControlCell = styled.div<{ active: boolean }>`
  ${tw`w-1/2 text-xl items-center flex justify-center h-full`}
  ${({ active }) => (active ? tw` bg-white rounded-full dark:bg-opacity-5` : tw`opacity-20  `)}
`;

const StyledFlexBox = styled.div`
  ${tw`flex  w-full justify-between h-fit items-start`}
`;

const StyledPlaceholderIcon = styled.div`
  ${tw`mx-auto mt-60 size-14 transition-all  rounded-full`}
  background-color: ${COLOR_ITEMS[4].color};
`;

const SapientorChatSheet = () => {
  const { isChatSheetVisible, setChatSheetVisible, useSapientorAssistentModel, changeModel } =
    useCurrentSapientorConversation();
  const [chatMessageEntities] = useEntities((e) => e.has(MessageRoleFacet));
  const displayLoadingAnimation = useDisplayLoadingAnimation();

  const navigateBack = () => setChatSheetVisible(false);

  return (
    <Sheet visible={isChatSheetVisible} navigateBack={navigateBack}>
      <StyledContentWrapper>
        <StyledFlexBox>
          <div />

          <StyledSegmentedControlWrapper>
            <StyledSegmentedControlCell
              onClick={() => changeModel(SupportedModel.TURBO)}
              active={!useSapientorAssistentModel}
            >
              <IoFlash />
            </StyledSegmentedControlCell>
            <StyledSegmentedControlCell
              onClick={() => changeModel(SupportedModel.SAPIENTOR_ASSISTENT)}
              active={useSapientorAssistentModel}
            >
              <IoBulb />
            </StyledSegmentedControlCell>
          </StyledSegmentedControlWrapper>

          <StyledCloseButtonWrapper onClick={navigateBack}>
            <IoClose />
          </StyledCloseButtonWrapper>
        </StyledFlexBox>
        <Spacer />
        <ScrollableBox>
          {chatMessageEntities.length === 0 && <StyledPlaceholderIcon />}
          <EntityPropsMapper
            query={(e) => e.has(MessageRoleFacet)}
            get={[[TextFacet, MessageRoleFacet, RelatedResourcesFacet], []]}
            sort={(a, b) => sortMessageEntitiesByDateAdded(a, b)}
            onMatch={ChatMessage}
          />
          {displayLoadingAnimation && (
            <SapientorConversationMessage
              message={{
                role: 'gpt',
                message: '',
              }}
              isLoading
            />
          )}
        </ScrollableBox>
      </StyledContentWrapper>
      <StyledPromptTextBoxWrapper>
        <SapientorPromptBox isVisible={isChatSheetVisible} />
      </StyledPromptTextBoxWrapper>
    </Sheet>
  );
};

export default SapientorChatSheet;
