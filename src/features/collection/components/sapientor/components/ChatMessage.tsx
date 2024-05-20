import { TextProps } from "@leanscope/ecs-models";
import { motion } from "framer-motion";
import { MessageRoleProps } from "../../../../../app/additionalFacets";
import { MessageRoles } from "../../../../../base/enums";
import SapientorConversationMessage from "../../../../../components/content/SapientorConversationMessage";

// const StyledSapientorOutline = styled.div`
//   ${tw`w-full mt-2 rounded-t-full h-6`}
//   background-color: ${COLOR_ITEMS[0].backgroundColor};
// `;

// const StyledSapientorEyeWrapper = styled.div`
//   ${tw`flex px-2 pt-2 justify-between`}
// `;

// const StyledSapientorEye = styled.div`
//   ${tw`size-1 rounded-full`}
//   background-color: ${COLOR_ITEMS[0].color};
// `;

// const SapientorIcon = () => {
//   return (
//     <StyledSapientorOutline>
//       <StyledSapientorEyeWrapper>
//         <StyledSapientorEye />
//         <StyledSapientorEye />
//       </StyledSapientorEyeWrapper>
//     </StyledSapientorOutline>
//   );
// };

// const StyledMessageContentWrapper = styled.div<{ role: MessageRoles }>`
//   ${tw` w-full md:w-fit min-w-64 max-w-[70%] transition-all rounded-xl p-2 `}
//   ${({ role }) =>
//     role === MessageRoles.USER
//       ? tw`rounded-br-none ml-8 bg-tertiary dark:text-primaryTextDark  dark:bg-tertiaryDark`
//       : tw`rounded-bl-none  font-semibold`}
//   background-color:  ${({ role }) => (role == MessageRoles.USER ? "" : COLOR_ITEMS[0].backgroundColor)};
//   color: ${({ role }) => (role == MessageRoles.USER ? "" : COLOR_ITEMS[0].color)};
// `;

// const StyledSpaientorIconWrapper = styled.div`
//   ${tw`size-7 mr-2.5 rounded-full overflow-hidden bg-tertiary dark:bg-tertiaryDark`}
// `;

// const StyledMessageWrapper = styled.div<{ role: MessageRoles }>`
//   ${tw`flex mb-1 w-full items-end `}
//   ${({ role }) => (role == MessageRoles.USER ? tw`justify-end` : tw`justify-start`)}
// `;

const ChatMessage = (props: TextProps & MessageRoleProps) => {
  const { text, role } = props;

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
        {/* {role === MessageRoles.SAPIENTOR ? (
          <StyledMessageWrapper role={role}>
            <StyledSpaientorIconWrapper>
              <SapientorIcon />
            </StyledSpaientorIconWrapper>
            <StyledMessageContentWrapper role={role}>
              <div>{text}</div>
            </StyledMessageContentWrapper>
          </StyledMessageWrapper>
        ) : (
          <StyledMessageWrapper role={role}>
            <StyledMessageContentWrapper role={role}>
              <div>{text}</div>
            </StyledMessageContentWrapper>
          </StyledMessageWrapper>
        )} */}
        <SapientorConversationMessage
          message={{
            role: role == MessageRoles.USER ? "user" : "gpt",
            message: text,
          }}
        />
      </motion.div>
    </div>
  );
};

export default ChatMessage;
