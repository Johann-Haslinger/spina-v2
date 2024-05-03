import { useEffect, useState } from "react";
import TypingAnimationInnerHTML from "./TypingAnimationInnerHTML";
import Spacer from "../layout/Spacer";
import styled from "@emotion/styled/macro";
import tw from "twin.macro";

type SapientorMessage = {
  role: "gpt" | "user";
  message: string;
  specialContent?: any;
};

const StyledMessageHeader = styled.div`
  ${tw`flex items-center space-y-1 space-x-3`}
`;

const StyledRoleIcon = styled.div<{ role: "gpt" | "user" }>`
  ${tw`w-4 h-4 rounded-full`}
  background-color: ${(props) => (props.role === "gpt" ? "#127C3E" : "#FFA500")};
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
}) => {
  const { message, onWritingAnimationPlayed } = props;
  const [additionalContent, setAdditionalContent] = useState<any>(null);

  useEffect(() => {
    setTimeout(() => {
      setAdditionalContent(message.specialContent);
    }, 400);
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
        ) : (
          <TypingAnimationInnerHTML
            onWritingAnimationPlayed={onWritingAnimationPlayed}
            playAnimation={true}
            text={message.message}
          />
        )}
      </StyledMessageWrapper>

      {additionalContent && additionalContent}
    </div>
  );
};

export default SapientorConversationMessage;
