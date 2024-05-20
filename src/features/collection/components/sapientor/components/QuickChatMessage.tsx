import styled from "@emotion/styled";
import { TextProps } from "@leanscope/ecs-models";
import { motion } from "framer-motion";
import tw from "twin.macro";
import { MessageRoleProps } from "../../../../../app/additionalFacets";
import { COLOR_ITEMS } from "../../../../../base/constants";
import { MessageRoles } from "../../../../../base/enums";

const StyledMessageContentWrapper = styled.div<{ role: MessageRoles }>`
  ${tw` ml-8   mb-1 w-72  bg-tertiary dark:text-primaryTextDark  dark:bg-seconderyDark pb-3 transition-all rounded-xl p-2 `}
  ${({ role }) => (role == MessageRoles.USER ? tw`rounded-br-none ` : tw`rounded-bl-none  `)}
`;

const StyledMessageHeader = styled.div`
  ${tw`flex items-center space-y-1 space-x-3`}
`;

const StyledRoleIcon = styled.div<{ role: MessageRoles }>`
  ${tw`w-4 h-4 rounded-full`}
  background-color: ${(props) =>
    props.role === MessageRoles.SAPIENTOR ? COLOR_ITEMS[0].backgroundColor : COLOR_ITEMS[1].backgroundColor};
`;

const StyledRoleTitle = styled.p`
  ${tw` mb-2 font-semibold`}
`;

const StyledTextWrapper = styled.div`
  ${tw`pl-6 line-clamp-3`}
`;

const QuickChatMessage = (props: TextProps & MessageRoleProps) => {
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
        <StyledMessageContentWrapper role={role}>
          <StyledMessageHeader>
            <StyledRoleIcon role={role} />
            <StyledRoleTitle>{role === MessageRoles.USER ? "Du" : "Sapientor"}</StyledRoleTitle>
          </StyledMessageHeader>

          <StyledTextWrapper>{text}</StyledTextWrapper>
        </StyledMessageContentWrapper>
      </motion.div>
    </div>
  );
};

export default QuickChatMessage;
