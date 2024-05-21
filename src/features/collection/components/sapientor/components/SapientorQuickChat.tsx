import styled from "@emotion/styled";
import { EntityPropsMapper } from "@leanscope/ecs-engine";
import { TextFacet } from "@leanscope/ecs-models";
import { motion } from "framer-motion";
import { Fragment } from "react/jsx-runtime";
import tw from "twin.macro";
import { MessageRoleFacet, RelatedResourcesFacet } from "../../../../../app/additionalFacets";
import { sortMessageEntitiesByDateAdded } from "../../../../../utils/sortEntitiesByTime";
import GenerateAnswerSystem from "../systems/GenerateAnswerSystem";
import QuickChatMessage from "./QuickChatMessage";
import SapientorPromptBox from "./SapientorPromptBox";

const StyledMessagesWrapper = styled.div`
  ${tw`w-80 mr-8`}
`;

const StyledPromptBoxWrapper = styled.div`
  ${tw`w-72 ml-8  `}
`;

const SapientorQuickChat = (props: { isVisible: boolean; openChatView: () => void }) => {
  const { isVisible, openChatView } = props;

  return (
    <Fragment>
      <GenerateAnswerSystem />

      <motion.div
        style={{
          position: "fixed",
          bottom: 0,
        }}
        initial={{ opacity: 0, y: 80, right: 96 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 80, right: 96 }}
      >
        <StyledMessagesWrapper onClick={openChatView}>
          <EntityPropsMapper
            query={(e) => e.has(MessageRoleFacet)}
            get={[[TextFacet, MessageRoleFacet, RelatedResourcesFacet], []]}
            sort={(a, b) => sortMessageEntitiesByDateAdded(a, b)}
            onMatch={QuickChatMessage}
          />
        </StyledMessagesWrapper>
        <StyledPromptBoxWrapper>
          <SapientorPromptBox isVisible={isVisible} />
        </StyledPromptBoxWrapper>
      </motion.div>
    </Fragment>
  );
};

export default SapientorQuickChat;
