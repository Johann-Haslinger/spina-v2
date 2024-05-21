import styled from "@emotion/styled";
import { EntityPropsMapper } from "@leanscope/ecs-engine";
import { TextFacet } from "@leanscope/ecs-models";
import { IoClose } from "react-icons/io5";
import tw from "twin.macro";
import { MessageRoleFacet, RelatedResourcesFacet } from "../../../../../app/additionalFacets";
import { FlexBox, ScrollableBox, Sheet, Spacer } from "../../../../../components";
import { sortMessageEntitiesByDateAdded } from "../../../../../utils/sortEntitiesByTime";
import ChatMessage from "./ChatMessage";
import SapientorPromptBox from "./SapientorPromptBox";

const StyledCloseButtonWrapper = styled.div`
  ${tw`p-1 transition-all md:hover:opacity-50 relative left-2 dark:bg-tertiaryDark dark:text-seconderyTextDark bg-tertiary rounded-full text-lg text-seconderyTextDark`}
`;
const StyledPromptTextBoxWrapper = styled.div`
  ${tw` h-[18%] w-full md:w-2/3 mx-auto pt-8 `}
`;

const StyledContentWrapper = styled.div`
  ${tw`w-full h-[87%]`}
`;

const SapientorChatView = (props: { isVisible: boolean; navigateBack: () => void }) => {
  const { isVisible, navigateBack } = props;

  return (
    <Sheet visible={isVisible} navigateBack={navigateBack}>
      <StyledContentWrapper>
        <FlexBox>
          <div />
          <StyledCloseButtonWrapper onClick={navigateBack}>
            <IoClose />
          </StyledCloseButtonWrapper>
        </FlexBox>
        <Spacer />
        <ScrollableBox>
          <EntityPropsMapper
            query={(e) => e.has(MessageRoleFacet)}
            get={[[TextFacet, MessageRoleFacet, RelatedResourcesFacet], []]}
            sort={(a, b) => sortMessageEntitiesByDateAdded(a, b)}
            onMatch={ChatMessage}
          />
        </ScrollableBox>
      </StyledContentWrapper>
      <StyledPromptTextBoxWrapper>
        <SapientorPromptBox isVisible={isVisible} />
      </StyledPromptTextBoxWrapper>
    </Sheet>
  );
};

export default SapientorChatView;
