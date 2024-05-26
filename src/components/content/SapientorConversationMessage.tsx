import styled from "@emotion/styled/macro";
import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import tw from "twin.macro";
import { COLOR_ITEMS } from "../../base/constants";
import Spacer from "../layout/Spacer";
import TypingAnimationInnerHTML from "./TypingAnimationInnerHTML";

type SapientorMessage = {
  role: "gpt" | "user";
  message: string;
  specialContent?: ReactNode;
};

const StyledMessageHeader = styled.div`
  ${tw`flex items-center space-y-1 space-x-3`}
`;

const StyledRoleIcon = styled.div<{ role: "gpt" | "user" }>`
  ${tw`w-4 h-4 rounded-full`}
  background-color: ${(props) =>
    props.role === "gpt" ? COLOR_ITEMS[0].backgroundColor : COLOR_ITEMS[1].backgroundColor};
`;

const StyledRoleTitle = styled.p`
  ${tw`text-lg mb-1 font-semibold`}
`;

const StyledMessageWrapper = styled.div`
  ${tw`pl-8`}
`;

const SapientorConversationMessage = (props: {
  message: SapientorMessage;
  onWritingAnimationPlayed?: () => void;
  isLoading?: boolean;
  playWritingAnimation?: boolean;
}) => {
  const { message, onWritingAnimationPlayed, isLoading } = props;
  const [additionalContent, setAdditionalContent] = useState<ReactNode>(null);

  // useEffect(() => {
  //   console.log('flashcards:', flashcards);

  //   if (flashcards.length > 0) {
  //     setAdditionalContent(<Fragment>
  //       {flashcards.map((flashcard, index) => (
  //         <PreviewFlashcard updateFlashcard={() => { }} flashcard={flashcard} key={index} />
  //       ))}
  //     </Fragment>)
  //   }
  // }, [flashcards]);

  useEffect(() => {
    setTimeout(() => {
      setAdditionalContent(message.specialContent);
    }, 300);
  }, [message.specialContent]);

  return (
    <div>
      <Spacer size={6} />
      <StyledMessageHeader>
        <StyledRoleIcon role={message.role} />
        <StyledRoleTitle>{message.role === "user" ? "Du" : "Sapientor"}</StyledRoleTitle>
      </StyledMessageHeader>

      <StyledMessageWrapper>
        {message.role === "user" ? (
          message.message
        ) : isLoading ? (
          <div className={`flex items-center mt-4 ml-8  `}>
            <motion.div
              className=" w-4 h-4 bg-black rounded-full mx-1"
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
            <motion.div
              className="w-4 h-4 bg-black rounded-full mx-1"
              animate={{ y: [5, -5, 5] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-4 h-4 bg-black rounded-full mx-1"
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        ) : (
          <TypingAnimationInnerHTML
            onWritingAnimationPlayed={onWritingAnimationPlayed}
            playAnimation={true}
            text={message.message}
          />
        )}
      </StyledMessageWrapper>

      {additionalContent && (
        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          {additionalContent}
        </motion.div>
      )}
    </div>
  );
};

export default SapientorConversationMessage;
